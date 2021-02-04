const express = require('express');
const ExportSet = require('../classes/ExportSet');
const ImportSet = require('../classes/ImportSet');

module.exports = () => {
    const router = express.Router();

    // Get all ImportSets from S3
    router.get('/all', async (req, res) => {
        const importSets = await ImportSet.loadAll(req);
        res.send(importSets);
    });

    // Import a Set
    router.put('/set', async (req, res) => {
        try {
            const set = new ImportSet(req);
            await set.init();
            const importResult = await set.import();
            if (importResult.length > 0) {
                res.status(409).send({ failedDocuments: importResult });
            } else {
                res.status(200).send('OK');
            }
        } catch (err) {
            console.error(err);
            res.status(400).send(err.message);
        }
    });

    // Export a Set
    router.post('/set', async (req, res) => {
        try {
            const set = new ExportSet(req);
            await set.init(req);
            await set.export();
            res.status(200).send('OK');
        } catch (err) {
            console.error(err);
            res.status(err.status || 400).send(err.message);
        }
    });

    return router;
};
