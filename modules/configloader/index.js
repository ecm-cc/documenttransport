const S3 = require('aws-sdk/clients/s3');

/**
 * Sends a request via the aws-sdk to get the config file
 * @returns {Promise} Promise object represents the configuration
 */
async function load(systemName, appName) {
    const s3 = new S3();
    const params = {
        Bucket: `${appName}-config`,
        Key: `${systemName}.config.json`,
    };
    return Promise.resolve(await s3.getObject(params).promise());
}

/**
 * @module modules/configloader
 * Loads the configuration data from a s3 bucket
 * depending on the system (dev/qas/prod)
 */
module.exports.load = load;
