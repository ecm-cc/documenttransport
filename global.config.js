function load(tenant) {
    switch (tenant) {
    case '14q': return {
        repositoryId: '1a2cde3f-2913-3dc2-4a2e-e623459ac23a',
        host: 'https://able-group-dev.d-velop.cloud',
        bucketName: 'able-documenttransport-store',
        stage: 'DEV',
        excludeFields: {
            XDPER: ['UPN', 'E-Mail', 'Vorname', 'Name', 'Barcode'],
        },
        uniqueFields: {
            ADEB: [81],
            DKUND: [32],
            KAKAUF: [65],
            DKAUF: [65],
            XEVER: [15],
            XRVER: [15],
            AKUNR: [159],
            DKUNR: [159],
            XEVUN: [15],
            XCASE: [39],
            XDCAS: [39],
            ALIEF: [84],
            DLIEA: [84],
            ABEST: [70],
            DLIEB: [70],
            XLEV: [15],
            XLRV: [15],
            ALIRA: [159],
            DLIRD: [159],
            XLVU: [15],
            XPRTN: [47],
            XAPER: [127],
            XDPER: [100026, 127],
            AUNTE: [144],
            DUNTE: [144],
        },
        /* categories: [
            {
                id: 'ADEB',
                uniqueFieldId: 81,
            },
            {
                id: 'DKUND',
                categoryName: 'Kunden - Allgemeine Dokumente',
                uniqueFieldName: 'Geschäftspartner ID',
                parent: 'ADEB',
                uniqueFieldId: 32,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'AKAUF',
                uniqueFieldId: 65,
            },
            {
                id: 'DKAUF',
                categoryName: 'Kunden - Auftragsdokumente',
                uniqueFieldName: 'Kontraktnummer',
                parent: 'AKAUF',
                uniqueFieldId: 65,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XEVER',
                uniqueFieldId: 15,
            },
            {
                id: 'XRVER',
                uniqueFieldId: 15,
            },
            {
                id: 'AKUNR',
                uniqueFieldId: 159,
            },
            {
                id: 'DKUNR',
                categoryName: 'Kunden - Rechnungsdokumente',
                uniqueFieldName: 'Rechnungsnummer',
                parent: 'AKUNR',
                uniqueFieldId: 159,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XEVUN',
                categoryName: 'Kunden - Vertragsunterlage',
                uniqueFieldName: 'Vertragsnummer (intern)',
                // DMS Search needs double quotes in order to work
                // eslint-disable-next-line quotes
                parent: ["XRVER", "XEVER"],
                uniqueFieldId: 15,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XCASE',
                uniqueFieldId: 39,
            },
            {
                id: 'XDCAS',
                categoryName: 'Legal - Vorgangsdokumente',
                uniqueFieldName: 'Vorgangsnummer (intern)',
                parent: 'XCASE',
                uniqueFieldId: 39,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'ALIEF',
                uniqueFieldId: 84,
            },
            {
                id: 'DLIEA',
                categoryName: 'Lieferanten - Allgemeine Dokumente',
                uniqueFieldName: 'Kreditorennummer',
                parent: 'ALIEF',
                uniqueFieldId: 84,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'ABEST',
                uniqueFieldId: 70,
            },
            {
                id: 'DLIEB',
                categoryName: 'Lieferanten - Bestelldokumente',
                uniqueFieldName: 'Bestellnummer',
                parent: 'ABEST',
                uniqueFieldId: 70,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XLEV',
                uniqueFieldId: 15,
            },
            {
                id: 'XLRV',
                uniqueFieldId: 15,
            },
            {
                id: 'ALIRA',
                uniqueFieldId: 159,
            },
            {
                id: 'DLIRD',
                categoryName: 'Lieferanten - Rechnungsdokumente',
                uniqueFieldName: 'Rechnungsnummer',
                parent: 'ALIRA',
                uniqueFieldId: 159,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XLVU',
                categoryName: 'Lieferanten - Vertragsunterlage',
                uniqueFieldName: 'Vertragsnummer (intern)',
                // DMS Search needs double quotes in order to work
                // eslint-disable-next-line quotes
                parent: ["XLEV", "XLRV"],
                uniqueFieldId: 15,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XPRTN',
                uniqueFieldId: 47,
            },
            {
                id: 'XAPER',
                uniqueFieldId: 127,
            },
            {
                // TODO Rename this an organize
                // if register in document filled -> register is the parent
                // if no register in document filled -> dossier is the parent
                id: 'XDPER',
                categoryName: 'Personaldokumente',
                uniqueFieldName: 'Personalnummer',
                parent: 'XAPER',
                uniqueFieldId: 127,
                excludeFields: ['UPN', 'E-Mail', 'Vorname', 'Name', 'Barcode'],
                registerId: 100026,
            },
            /**
            {
                id: 'XDPER',
                categoryName: 'Personaldokumente',
                register: {
                    id: 'XPREG',
                    uniqueFieldId: [127, 100026],
                    uniqueFieldName: ['Personalnummer', 'Register'],
                },
                dossier: {
                    id: 'XAPER',
                    uniqueFieldId: [127],
                    uniqueFieldName: ['Personalnummer'],
                }
                excludeFields: ['UPN', 'E-Mail', 'Vorname', 'Name', 'Barcode'],
            },

            {
                id: 'AREKA',
                uniqueFieldId: 65,
            },
            {
                id: 'ADEBA',
                uniqueFieldId: 81,
            },
            {
                id: 'ARELB',
                uniqueFieldId: 70,
            },
            {
                id: 'ALIER',
                uniqueFieldId: 84,
            },
            {
                id: 'AVERO',
                uniqueFieldId: 15,
            },
            {
                id: 'XPREG',
                uniqueFieldId: 127,
            },
            {
                id: 'AUNTR',
                uniqueFieldId: 144,
            },
            {
                id: 'AVORO',
                uniqueFieldId: 39,
            },
            {
                id: 'SAPDE',
                uniqueFieldId: -1,
            },
            {
                id: 'DSAPE',
                uniqueFieldId: 100018,
            },
            {
                id: 'SAPDO',
                uniqueFieldId: -1,
            },
            {
                id: 'DSAPH',
                uniqueFieldId: 100018,
            },
            {
                id: 'AUNTE',
                uniqueFieldId: 144,
            },
            {
                id: 'DUNTE',
                categoryName: 'Unternehmensdokument',
                uniqueFieldName: 'ID des Unternehmens',
                parent: 'AUNTE',
                uniqueFieldId: 144,
                excludeFields: [],
                registerId: 100026,
            },
        ], */
    };
    case '197': return {
        repositoryId: '64bdf712-b328-5f46-8fd0-b8e67aaf8bec',
        host: 'https://able-group-qas.d-velop.cloud',
        bucketName: 'able-documenttransport-store',
        stage: 'QAS',
        categories: [
            {
                id: 'ADEB',
                uniqueFieldId: 138,
            },
            {
                id: 'DKUND',
                categoryName: 'Kunden - Allgemeine Dokumente',
                uniqueFieldName: 'Geschäftspartner ID',
                parent: 'ADEB',
                uniqueFieldId: 138,
                excludeFields: [],
                registerId: 168,
            },
            {
                id: 'AKAUF',
                uniqueFieldId: 151,
            },
            {
                id: 'DKAUF',
                categoryName: 'Kunden - Auftragsdokumente',
                uniqueFieldName: 'Kontraktnummer',
                parent: 'AKAUF',
                uniqueFieldId: 151,
                excludeFields: [],
                registerId: 168,
            },
            {
                id: 'XEVER',
                uniqueFieldId: 6,
            },
            {
                id: 'XRVER',
                uniqueFieldId: 6,
            },
            {
                id: 'AKUNR',
                uniqueFieldId: 199,
            },
            {
                id: 'DKUNR',
                categoryName: 'Kunden - Rechnungsdokumente',
                uniqueFieldName: 'Rechnungsnummer',
                parent: 'AKUNR',
                uniqueFieldId: 199,
                excludeFields: [],
                registerId: 168,
            },
            {
                id: 'XEVUN',
                categoryName: 'Kunden - Vertragsunterlage',
                uniqueFieldName: 'Vertragsnummer (intern)',
                // DMS Search needs double quotes in order to work
                // eslint-disable-next-line quotes
                parent: ["XRVER", "XEVER"],
                uniqueFieldId: 6,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XCASE',
                uniqueFieldId: 83,
            },
            {
                id: 'XDCAS',
                categoryName: 'Legal - Vorgangsdokumente',
                uniqueFieldName: 'Vorgangsnummer (intern)',
                parent: 'XCASE',
                uniqueFieldId: 83,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'ALIEF',
                uniqueFieldId: 154,
            },
            {
                id: 'DLIEA',
                categoryName: 'Lieferanten - Allgemeine Dokumente',
                uniqueFieldName: 'Kreditorennummer',
                parent: 'ALIEF',
                uniqueFieldId: 154,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'ABEST',
                uniqueFieldId: 153,
            },
            {
                id: 'DLIEB',
                categoryName: 'Lieferanten - Bestelldokumente',
                uniqueFieldName: 'Bestellnummer',
                parent: 'ABEST',
                uniqueFieldId: 153,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XLEV',
                uniqueFieldId: 6,
            },
            {
                id: 'XLRV',
                uniqueFieldId: 6,
            },
            {
                id: 'ALIRA',
                uniqueFieldId: 199,
            },
            {
                id: 'DLIRD',
                categoryName: 'Lieferanten - Rechnungsdokumente',
                uniqueFieldName: 'Rechnungsnummer',
                parent: 'ALIRA',
                uniqueFieldId: 199,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XLVU',
                categoryName: 'Lieferanten - Vertragsunterlage',
                uniqueFieldName: 'Vertragsnummer (intern)',
                // DMS Search needs double quotes in order to work
                // eslint-disable-next-line quotes
                parent: ["XLEV", "XLRV"],
                uniqueFieldId: 6,
                excludeFields: [],
                registerId: 100026,
            },
            {
                id: 'XPRTN',
                uniqueFieldId: 34,
            },
            {
                id: 'XAPER',
                uniqueFieldId: 120,
            },
            {
                // TODO Rename this an organize
                // if register in document filled -> register is the parent
                // if no register in document filled -> dossier is the parent
                id: 'XDPER',
                categoryName: 'Personaldokumente',
                uniqueFieldName: 'Personalnummer',
                parent: 'XAPER',
                uniqueFieldId: 120,
                excludeFields: ['UPN', 'E-Mail', 'Vorname', 'Name', 'Barcode'],
                registerId: 100026,
            },
            /**
            {
                id: 'XDPER',
                categoryName: 'Personaldokumente',
                register: {
                    id: 'XPREG',
                    uniqueFieldId: [127, 100026],
                    uniqueFieldName: ['Personalnummer', 'Register'],
                },
                dossier: {
                    id: 'XAPER',
                    uniqueFieldId: [127],
                    uniqueFieldName: ['Personalnummer'],
                }
                excludeFields: ['UPN', 'E-Mail', 'Vorname', 'Name', 'Barcode'],
            },
            */
            {
                id: 'AREKA',
                uniqueFieldId: 65,
            },
            {
                id: 'ADEBA',
                uniqueFieldId: 81,
            },
            {
                id: 'ARELB',
                uniqueFieldId: 70,
            },
            {
                id: 'ALIER',
                uniqueFieldId: 84,
            },
            {
                id: 'AVERO',
                uniqueFieldId: 15,
            },
            {
                id: 'XPREG',
                uniqueFieldId: 127,
            },
            {
                id: 'AUNTR',
                uniqueFieldId: 144,
            },
            {
                id: 'AVORO',
                uniqueFieldId: 39,
            },
            {
                id: 'SAPDE',
                uniqueFieldId: -1,
            },
            {
                id: 'DSAPE',
                uniqueFieldId: 100018,
            },
            {
                id: 'SAPDO',
                uniqueFieldId: -1,
            },
            {
                id: 'DSAPH',
                uniqueFieldId: 100018,
            },
            {
                id: 'AUNTE',
                uniqueFieldId: 124,
            },
            {
                id: 'DUNTE',
                categoryName: 'Unternehmensdokument',
                uniqueFieldName: 'ID des Unternehmens',
                parent: 'AUNTE',
                uniqueFieldId: 124,
                excludeFields: [],
                registerId: 100026,
            },
        ],
    };
    case '1ha': return {
        repositoryId: '576583f0-8cd0-5796-bc94-e49426e7bbfb',
        host: 'https://able-group-version.d-velop.cloud',
        bucketName: 'able-documenttransport-store',
        stage: 'Version',
    };
    // Default: Prod
    default: return {
        repositoryId: '16d943a8-4683-5ffb-b564-f3bf1903a967',
        host: 'https://able-group.d-velop.cloud',
        bucketName: 'able-documenttransport-store',
        stage: 'PROD',
    };
    }
}

module.exports = {
    load,
};
