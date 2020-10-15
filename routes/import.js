const express = require('express');

module.exports = (assetBasePath) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        console.log(`TenantId:${req.tenantId}`);
        console.log(`SystemBaseUri:${req.systemBaseUri}`);
        res.format({
            'text/html': async () => {
                res.render('import', {
                    title: 'Importieren',
                    stylesheet: `${assetBasePath}/global.css`,
                    script: `${assetBasePath}/import.js`,
                    body: '/../views/import.hbs',
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};
