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
        const postData = JSON.parse(req.body.set);
        this.name = postData.name;
        this.template = postData.template;
        this.documents = postData.documents.id;
    }

    async init() {
        await this.getSourceMapping();
        await this.getMeta();
        this.buildUploadObjects();
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

    buildUploadObjects() {
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
            // TODO: Muss nur für Personalakten (oder im zweiten Schritt Musterakten) gesetzt werden
            uploadPayload.parentId = ''; // Test Francis Bendel: D100125209
            this.uploadPayloads.push(uploadPayload);
        });
    }

    mapProperties(index) {
        const properties = [];
        this.meta[index].objectProperties.forEach((property) => {
            properties.push({
                key: this.sourceMapping.properties.find((sourceProperty) => sourceProperty.displayName === property.name).key,
                values: [property.value],
            });
        });
        return properties;
    }

    async import() {
        const promises = [];
        this.meta.forEach((documentMeta, index) => {
            promises.push(this.performImport(documentMeta, index));
        });
        await Promise.all(promises);
    }

    async performImport(documentMeta, index) {
        const file = await this.getS3File(documentMeta, index);
        this.uploadPayloads[index].contentLocationUri = await this.uploadFile(file);
        await this.uploadProperties(index);
        if (this.template !== true) {
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
        await axios(this.httpOptions);
    }

    async delete() {
        const promises = [];
        const setElements = await s3.listObjectsV2({ Bucket: this.config.bucketName, Prefix: `${this.name}/` }).promise();
        setElements.Contents.forEach((setElement) => {
            promises.push(s3.deleteObject({ Bucket: this.config.bucketName, Key: setElement.Key }).promise());
        });
        await Promise.all(promises);
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
