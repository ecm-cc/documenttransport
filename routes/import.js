const express = require('express');
const checkGroup = require('@ablegroup/checkgroup');
const loadHTTPOptions = require('@ablegroup/httpoptions');
const axios = require('axios');
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

        const httpOptions = loadHTTPOptions(req);
        httpOptions.url = `${config.host}/able-documenttransport/sets/all`;
        const importSets = await axios(httpOptions);

        res.format({
            'text/html': async () => {
                res.render('import', {
                    title: 'Importieren',
                    stylesheet: `${assetBasePath}/global.css`,
                    script: `${assetBasePath}/import.js`,
                    body: '/../views/import.hbs',
                    metaData: JSON.stringify(metaData),
                    importSets: importSets.data,
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
