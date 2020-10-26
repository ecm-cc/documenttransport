const express = require('express');
const checkGroup = require('@ablegroup/checkgroup');

module.exports = (assetBasePath) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const isAdmin = await checkGroup(req, 'DC4885EF-A72C-4489-95A1-F37269D6E48D'); // This group is per definition static, so no config needed
        console.log(`TenantId:${req.tenantId}`);
        console.log(`SystemBaseUri:${req.systemBaseUri}`);
        res.format({
            'text/html': async () => {
                res.render('import', {
                    title: 'Importieren',
                    stylesheet: `${assetBasePath}/global.css`,
                    script: `${assetBasePath}/import.js`,
                    body: '/../views/import.hbs',
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
