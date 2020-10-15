const express = require('express');

module.exports = (assetBasePath) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        console.log(`TenantId:${req.tenantId}`);
        console.log(`SystemBaseUri:${req.systemBaseUri}`);
        res.format({
            'text/html': async () => {
                res.render('export', {
                    title: 'Exportieren',
                    stylesheet: `${assetBasePath}/global.css`,
                    script: `${assetBasePath}/export.js`,
                    body: '/../views/export.hbs',
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};
