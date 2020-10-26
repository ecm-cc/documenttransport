const axios = require('axios');
const AWS = require('aws-sdk');
const stream = require('stream');
const Set = require('../Set');
const { ExportSetAlreadyExistingError } = require('../Errors');

const s3 = new AWS.S3({
    region: 'eu-central-1',
});

class ExportSet extends Set {
    constructor(req) {
        super(req);
        const postData = req.body;
        this.name = postData.name;
        this.template = postData.template;
        this.created = Date.now();
        this.meta = JSON.parse(postData.elements);
    }

    async init() {
        await this.setCreator();
        await this.setMeta();
    }

    async setCreator() {
        this.httpOptions.url = `${this.config.host}/identityprovider/validate?allowExternalValidation=true`;
        const user = await axios(this.httpOptions);
        this.creator = `${user.data.name.givenName} ${user.data.name.familyName}`;
    }

    async setMeta() {
        const promises = [];
        this.meta.forEach((metaElement) => {
            this.httpOptions.url = `${this.config.host}${metaElement._links.details.href.split('#')[0]}`;
            promises.push(axios(this.httpOptions));
        });
        const metaResponses = await Promise.all(promises);
        this.meta = metaResponses.map((response) => response.data);
    }

    async export() {
        const remoteSets = await s3.listObjectsV2({ Bucket: 'able-documenttransport-store' }).promise();
        if (remoteSets.Contents.some((remoteSet) => remoteSet.Key === `${this.name}/meta.json`)) {
            throw new ExportSetAlreadyExistingError(`ExportSet mit dem Namen "${this.name}" bereits vorhanden.`);
        }
        await Promise.all(this.createUploadPromises());
    }

    createUploadPromises() {
        const promises = [];
        promises.push(this.upload(`${this.name}/meta.json`, this.generateExportSetMeta()));
        this.meta.forEach((element) => {
            promises.push(this.upload(`${this.name}/${element.id}/meta.json`, JSON.stringify(element, null, 2)));
            promises.push(this.pipeDocument(element));
        });
        return promises;
    }

    generateExportSetMeta() {
        return JSON.stringify({
            name: this.name,
            template: this.template,
            created: this.created,
            creator: this.creator,
            count: this.meta.length,
            stage: this.config.stage,
            documents: {
                name: this.meta.map((metaElement) => getFileName(metaElement)),
                id: this.meta.map((metaElement) => metaElement.id),
            },
        }, null, 2);
    }

    async upload(path, content) {
        return s3.putObject({
            Bucket: this.config.bucketName,
            Key: path,
            Body: content,
        }).promise();
    }

    async pipeDocument(metaElement) {
        let promise = null;
        let contentType = 'application/octet-stream';
        this.httpOptions.url = `${this.config.host}${metaElement._links.self.href}/v/current/b/main/c`;
        this.httpOptions.responseType = 'stream';

        const uploadStream = () => {
            const pass = new stream.PassThrough();
            promise = s3.upload({
                Bucket: this.config.bucketName,
                Key: `${this.name}/${metaElement.id}/${getFileName(metaElement)}`,
                Body: pass,
                ContentType: contentType,
            }).promise();
            return pass;
        };

        const response = await axios(this.httpOptions);
        contentType = response.headers['content-type'];
        response.data.pipe(uploadStream());
        return promise;
    }
}

function getFileName(metaElement) {
    const fileName = metaElement.systemProperties.find((prop) => prop.id === 'property_filename').value;
    const fileType = metaElement.systemProperties.find((prop) => prop.id === 'property_filetype').value;
    return fileName.replace(fileType, fileType.toLowerCase());
}

module.exports = ExportSet;