const express = require('express');
const checkGroup = require('@ablegroup/checkgroup');
const configloader = require('../global.config');

let config = {};

module.exports = (assetBasePath) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        config = configloader.load(req.tenantId);
        const isAdmin = await checkGroup(req, 'DC4885EF-A72C-4489-95A1-F37269D6E48D'); // This group is per definition static, so no config needed
        const metaData = {
            config,
            assetBasePath,
        };

        console.log(`TenantId:${req.tenantId}`);
        console.log(`SystemBaseUri:${req.systemBaseUri}`);
        res.format({
            'text/html': async () => {
                res.render('export', {
                    title: 'Exportieren',
                    stylesheet: `${assetBasePath}/global.css`,
                    script: `${assetBasePath}/export.js`,
                    body: '/../views/export.hbs',
                    metaData: JSON.stringify(metaData),
                    isAdmin,
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};
