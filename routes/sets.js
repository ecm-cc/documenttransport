const express = require('express');
const ExportSet = require('../classes/ExportSet');
const ImportSet = require('../classes/ImportSet');
// const configloader = require('../global.config');

// let config = {};

module.exports = () => {
    const router = express.Router();

    // Get all ImportSets from S3
    router.get('/all', async (req, res) => {
        const importSets = await ImportSet.loadAll(req);
        res.send(importSets);
    });

    /* router.delete('/:id', async (req, res)) {

    } */

    // Import a Set
    router.put('/set', async (req, res) => {
        try {
            const set = new ImportSet(req);
            await set.init();
            await set.import();
            res.status(200).send('OK');
        } catch (err) {
            console.log(err);
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
            res.status(400).send(err.message);
        }
    });

    return router;
};
