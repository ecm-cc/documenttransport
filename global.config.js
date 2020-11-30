function load(tenant) {
    switch (tenant) {
    case '14q': return {
        repositoryId: '1a2cde3f-2913-3dc2-4a2e-e623459ac23a',
        host: 'https://able-group-dev.d-velop.cloud',
        bucketName: 'able-documenttransport-store',
        stage: 'DEV',
        categories: [
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
        ],
    };
    case '197': return {
        repositoryId: '64bdf712-b328-5f46-8fd0-b8e67aaf8bec',
        host: 'https://able-group-qas.d-velop.cloud',
        bucketName: 'able-documenttransport-store',
        stage: 'QAS',
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
