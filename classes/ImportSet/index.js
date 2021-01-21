const AWS = require('aws-sdk');
const axios = require('axios');
const mapping = require('@ablegroup/propertymapping');
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
        mapping.initDatabase();
    }

    async init() {
        await this.getMeta();
        await this.buildUploadObjects();
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
            this.uploadPayloads.push(uploadPayload);
            promises.push(this.mapProperties(documentMeta, index));
        });
        await Promise.all(promises);
    }

    async mapProperties(documentMeta, index) {
        const stage = this.config.stage.toLowerCase();
        const propertiesOfCategory = await mapping.getPropertiesByCategory(stage, null, null, this.meta[index].category);
        const excludeFields = this.config.excludeFields[this.meta[index].category];
        const properties = [];

        this.meta[index].objectProperties.forEach((property) => {
            if (property.value !== '' && (!excludeFields || !excludeFields.some((field) => field === property.name))) {
                if (propertiesOfCategory.some((prop) => prop.displayname === property.name)) {
                    properties.push({
                        key: propertiesOfCategory.find((prop) => prop.displayname === property.name).propertyKey,
                        values: [property.value],
                    });
                }
            }
        });
        this.uploadPayloads[index].sourceProperties = {
            properties,
        };

        const overwriteElement = this.parentsForCategory.find((element) => element.category === documentMeta.category);

        if (overwriteElement) {
            console.log('Try to overwrite parent for ', index, this.uploadPayloads[index]);
            this.uploadPayloads[index].sourceProperties.properties.forEach((property, i) => {
                console.log('Checking', property.key, overwriteElement.parentField);
                if (property.key.toString() === overwriteElement.parentField.toString()) {
                    // Reason: We want to manipulate the document metadata to overwrite the parent element
                    // eslint-disable-next-line no-param-reassign
                    property.values = [overwriteElement.parentValue];
                    this.uploadPayloads[index].sourceProperties.properties[i].values = [overwriteElement.parentValue];
                }
            });
        }
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
        try {
            const file = await this.getS3File(documentMeta, index);
            this.uploadPayloads[index].contentLocationUri = await this.uploadFile(file);
            await this.uploadProperties(index);
            if (this.template === '0') {
                await this.delete(index);
            }
        } catch (err) {
            let errMessage = err;
            if (err.response && err.response.data && err.response.data.reason) {
                errMessage = err.response.data.reason;
            }
            console.error(errMessage);
            this.failedToUpload.push({
                id: this.meta[index].id,
                name: this.meta[index],
                category: this.meta[index].systemProperties.find((property) => property.id === 'property_filename').value,
                message: errMessage,
            });
        }
        await this.updateMeta();
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
        await axios(this.httpOptions);
    }

    async delete(index) {
        let fileName = this.meta[index].systemProperties.find((property) => property.id === 'property_filename').value;
        const fileNameArray = fileName.split('.');
        fileNameArray[fileNameArray.length - 1] = fileNameArray[fileNameArray.length - 1].toLowerCase();
        fileName = fileNameArray.join('.');
        const documentID = this.meta[index].id;
        await s3.deleteObject({ Bucket: this.config.bucketName, Key: `${this.name}/${documentID}/meta.json` }).promise();
        await s3.deleteObject({ Bucket: this.config.bucketName, Key: `${this.name}/${documentID}/${fileName}` }).promise();
    }

    async updateMeta() {
        if (this.failedToUpload.length === 0 && this.template === '0') {
            await s3.deleteObject({ Bucket: this.config.bucketName, Key: `${this.name}/meta.json` }).promise();
        } else {
            const s3Response = await s3.getObject({ Bucket: this.config.bucketName, Key: `${this.name}/meta.json` }).promise();
            const metaElement = JSON.parse(s3Response.Body.toString('utf-8'));
            const indexesToDelete = [];
            metaElement.count -= this.failedToUpload.length;
            metaElement.documents.id.forEach((docId, i) => {
                if (!(this.failedToUpload.some((failedOne) => failedOne.id === docId))) {
                    indexesToDelete.push(i);
                }
            });
            indexesToDelete.forEach((index) => {
                delete metaElement.documents.id[index];
                delete metaElement.documents.name[index];
                delete metaElement.documents.category[index];
            });
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
