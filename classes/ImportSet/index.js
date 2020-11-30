const AWS = require('aws-sdk');
const axios = require('axios');
const Set = require('../Set');
const configLoader = require('../../global.config');

const s3 = new AWS.S3({
    region: 'eu-central-1',
});

class ImportSet extends Set {
    constructor(req) {
        super(req);
        const postData = req.body;
        const setPostData = JSON.parse(postData.set);
        this.name = setPostData.name;
        this.template = setPostData.template;
        this.documents = setPostData.documents.id;
        this.parentsForCategory = JSON.parse(postData.parentForCategory);
        this.newAttributes = postData.newAttributes;
        this.failedToUpload = [];
    }

    async init() {
        await this.getSourceMapping();
        await this.getMeta();
        await this.buildUploadObjects();
    }

    async getSourceMapping() {
        this.httpOptions.url = `${this.config.host}/dms/r/${this.config.repositoryId}/source`;
        const response = await axios(this.httpOptions);
        this.sourceMapping = response.data;
    }

    async getMeta() {
        const promises = [];
        this.documents.forEach((documentId) => {
            promises.push(s3.getObject({ Bucket: this.config.bucketName, Key: `${this.name}/${documentId}/meta.json` }).promise());
        });
        const metaResponses = await Promise.all(promises);
        this.meta = metaResponses.map((meta) => JSON.parse(meta.Body.toString('utf-8')));
    }

    async buildUploadObjects() {
        const promises = [];
        this.uploadPayloads = [];
        this.meta.forEach((documentMeta, index) => {
            const uploadPayload = {};
            uploadPayload.fileName = documentMeta.systemProperties.find((property) => property.id === 'property_filename').value;
            const fileExtension = uploadPayload.fileName.split('.')[uploadPayload.fileName.split('.').length - 1];
            uploadPayload.fileName = uploadPayload.fileName.replace(fileExtension, fileExtension.toLowerCase());
            uploadPayload.alterationText = 'Imported with able-documenttransport';
            uploadPayload.sourceCategory = documentMeta.systemProperties.find((property) => property.id === 'property_category').value;
            uploadPayload.sourceId = `/dms/r/${this.config.repositoryId}/source`;
            uploadPayload.sourceProperties = {
                properties: this.mapProperties(index),
            };
            this.uploadPayloads.push(uploadPayload);
            promises.push(this.setParentId(documentMeta, index));
        });
        await Promise.all(promises);
    }

    mapProperties(index) {
        const properties = [];
        const categoryConfig = this.config.categories.find((category) => category.categoryName === this.meta[index].category);
        this.meta[index].objectProperties.forEach((property) => {
            if (property.value !== '' && categoryConfig.excludeFields && !categoryConfig.excludeFields.some((field) => field === property.name)) {
                properties.push({
                    key: this.sourceMapping.properties.find((sourceProperty) => sourceProperty.displayName === property.name).key,
                    values: property.value === '' ? [] : [property.value],
                });
            }
        });
        return properties;
    }

    async setParentId(child, index) {
        if (this.parentsForCategory.some((element) => element.category === child.category)) {
            await this.setOverwrittenParent(child, index);
        } else {
            await this.setDefaultParent(child.id, index);
        }
    }

    async setDefaultParent(childId, index) {
        this.httpOptions.url = `${this.config.host}/dms/r/${this.config.repositoryId}/fo?parents_of=${childId}`;
        const response = await axios(this.httpOptions);
        try {
            const parentItems = response.data.rootFolderPaths[0].items;
            this.uploadPayloads[index].parentId = parentItems[parentItems.length - 1].id;
        } catch (err) {
            this.uploadPayloads[index].parentId = '';
        }
    }

    async setOverwrittenParent(element, index) {
        const parentForCategory = this.parentsForCategory.find((cat) => cat.category === element.category);

        this.httpOptions.url = this.getSearchURL(element, parentForCategory);
        const response = await axios(this.httpOptions);
        this.uploadPayloads[index].parentId = response.data.items[0].id;

        this.uploadPayloads[index].sourceProperties.properties.forEach((property) => {
            if (property.key === parentForCategory.parentField) {
                // eslint-disable-next-line no-param-reassign
                property.values = [parentForCategory.parentValue];
            }
        });

        return this.meta;
    }

    getSearchURL(element, parentForCategory) {
        const categoryConfig = this.config.categories.find((category) => category.categoryName === parentForCategory.category);

        const urlHost = `${this.config.host}/dms/r/${this.config.repositoryId}/sr/?objectdefinitionids=`;
        const searchCategory = Array.isArray(categoryConfig.parent) ? categoryConfig.parent : `["${categoryConfig.parent}"]`;
        const searchUniqueField = `"${categoryConfig.uniqueFieldId}":["${parentForCategory.parentValue}"]`;

        const registerProp = element.objectProperties.find((prop) => prop.name === 'Register');
        const searchRegister = registerProp.value !== '' && categoryConfig.registerId > 0 ? `,"${categoryConfig.registerId}":["${registerProp.value}"]` : '';

        const searchQuery = `${searchCategory}&properties={${searchUniqueField}${searchRegister}}`;

        return `${urlHost}${searchQuery}`;
    }

    async import() {
        const promises = [];
        this.meta.forEach((documentMeta, index) => {
            promises.push(this.performImport(documentMeta, index));
        });
        await Promise.all(promises);
        return this.failedToUpload;
    }

    async performImport(documentMeta, index) {
        const file = await this.getS3File(documentMeta, index);
        this.uploadPayloads[index].contentLocationUri = await this.uploadFile(file);
        await this.uploadProperties(index);
        if (this.template === '0') {
            await this.delete();
        }
    }

    async getS3File(documentMeta, index) {
        const s3Key = `${this.name}/${documentMeta.id}/${this.uploadPayloads[index].fileName}`;
        const s3Response = await s3.getObject({ Bucket: this.config.bucketName, Key: s3Key }).promise();
        return s3Response.Body;
    }

    async uploadFile(file) {
        this.httpOptions.url = `${this.config.host}/dms/r/${this.config.repositoryId}/blob/chunk`;
        this.httpOptions.method = 'POST';
        this.httpOptions.headers['Content-Type'] = 'application/octet-stream';
        this.httpOptions.data = Buffer.from(file);
        const uploadResponse = await axios(this.httpOptions);
        return uploadResponse.headers.location;
    }

    async uploadProperties(index) {
        this.httpOptions.headers['Content-Type'] = 'application/json';
        this.httpOptions.url = `${this.config.host}/dms/r/${this.config.repositoryId}/o2m`;
        this.httpOptions.data = this.uploadPayloads[index];
        try {
            await axios(this.httpOptions);
        } catch (err) {
            this.failedToUpload.push(this.meta[index].id);
            // TODO Push more than only id -> Same content as documentlist in meta.json
        }
    }

    async delete() {
        const promises = [];
        const setElements = await s3.listObjectsV2({ Bucket: this.config.bucketName, Prefix: `${this.name}/` }).promise();
        setElements.Contents.forEach((setElement) => {
            if (!this.failedToUpload.some((failedElement) => setElement.Key.includes(failedElement)) && setElement.Key !== `${this.name}/meta.json`) {
                promises.push(s3.deleteObject({ Bucket: this.config.bucketName, Key: setElement.Key }).promise());
            }
        });
        await Promise.all(promises);
        await this.updateMeta();
    }

    async updateMeta() {
        if (this.failedToUpload.length === 0) {
            await s3.deleteObject({ Bucket: this.config.bucketName, Key: `${this.name}/meta.json` }).promise();
        } else {
            // Change meta.json, so all failed documents remain
        }
    }
}

module.exports = ImportSet;
module.exports.loadAll = async (req) => {
    const promises = [];
    const config = configLoader.load(req.get('x-dv-tenant-id'));
    const setElements = await s3.listObjectsV2({ Bucket: config.bucketName }).promise();
    const setNames = setElements.Contents.map((setElement) => setElement.Key.split('/')[0]);
    const setNamesUnique = setNames.filter((elem, pos) => setNames.indexOf(elem) === pos);
    setNamesUnique.forEach((setName) => {
        promises.push(s3.getObject({ Bucket: config.bucketName, Key: `${setName}/meta.json` }).promise());
    });
    const rawMetas = await Promise.all(promises);
    return rawMetas.map((meta) => JSON.parse(meta.Body.toString('utf-8')));
};
