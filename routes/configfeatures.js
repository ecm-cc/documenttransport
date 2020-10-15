const express = require('express');

module.exports = (appName) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.format({
            'application/hal+json': () => {
                res.send({
                    appName: `${appName}`,
                    customHeadlines: [
                        {
                            caption: 'Dokumente kopieren',
                            description: 'Exportieren und importieren Sie Dokumente zwischen verschiedenen Stages',
                            menuItems: [
                                {
                                    caption: 'Export',
                                    description: 'Exportieren Sie Dokumente für eine andere Stage',
                                    href: `/${appName}/export`,
                                    keywords: ['Export', 'Dokumente', 'Transport', 'Import', 'Stage', 'Muster'],
                                    configurationState: 0,
                                },
                                {
                                    caption: 'Import',
                                    description: 'Importieren Sie Dokumente aus einer anderen Stage',
                                    href: `/${appName}/import`,
                                    keywords: ['Export', 'Dokumente', 'Transport', 'Import', 'Stage', 'Muster'],
                                    configurationState: 0,
                                },
                            ],
                        },
                    ],
                });
            },
            default: () => {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};
