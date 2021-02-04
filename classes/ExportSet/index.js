const axios = require('axios');
const AWS = require('aws-sdk');
const stream = require('stream');
const Set = require('../Set');
const { ExportSetAlreadyExistingError, DownloadNotAllowedError } = require('../Errors');

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
        await this.setCategories();
    }

    async setCreator() {
        this.httpOptions.url = `${this.config.host}/identityprovider/validate?allowExternalValidation=true`;
        const user = await axios(this.httpOptions);
        this.creator = `${user.data.name.givenName} ${user.data.name.familyName}`;
    }

    async setMeta() {
        const promises = [];
        this.meta.forEach((metaElement) => {
            this.httpOptions.url = `${this.config.host}/dms/r/${this.config.repositoryId}/o2/${metaElement.id}`;
            promises.push(axios(this.httpOptions));
        });
        const metaResponses = await Promise.all(promises);
        this.meta = metaResponses.map((response) => response.data);
    }

    async setCategories() {
        this.httpOptions.url = `${this.config.host}/dms/r/${this.config.repositoryId}/source`;
        const response = await axios(this.httpOptions);
        this.categories = response.data.categories;
    }

    async export() {
        const remoteSets = await s3.listObjectsV2({ Bucket: this.config.bucketName }).promise();
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
            tenant: this.tenant,
            documents: {
                name: this.meta.map((metaElement) => getFileName(metaElement)),
                id: this.meta.map((metaElement) => metaElement.id),
                category: this.buildCategories(),
            },
        }, null, 2);
    }

    buildCategories() {
        const fullCategories = [];
        const categoryNames = this.meta.map((metaElement) => metaElement.category);
        categoryNames.forEach((category) => {
            fullCategories.push(this.categories.find((c) => c.displayName === category));
        });
        return fullCategories;
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
        try {
            const response = await axios(this.httpOptions);
            contentType = response.headers['content-type'];
            response.data.pipe(uploadStream());
            return promise;
        } catch (err) {
            const elementList = await s3.listObjectsV2({ Bucket: this.config.bucketName }).promise();
            const elementListFiltered = elementList.Contents.filter((elem) => elem.Key.includes(`${this.name}/`)).map((elem) => ({ Key: elem.Key }));
            await s3.deleteObjects({ Bucket: this.config.bucketName, Delete: { Objects: elementListFiltered } }).promise();
            throw new DownloadNotAllowedError('Sie besitzen nicht die nötigen Berechtigungen, um diese Dokumentenkategorie zu exportieren.');
        }
    }
}

function getFileName(metaElement) {
    const fileName = metaElement.systemProperties.find((prop) => prop.id === 'property_filename').value;
    const fileType = metaElement.systemProperties.find((prop) => prop.id === 'property_filetype').value;
    return fileName.replace(fileType, fileType.toLowerCase());
}

module.exports = ExportSet;
