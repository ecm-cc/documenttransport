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
            AKAUF: [65],
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
            XDPER: [127],
            AUNTE: [144],
            DUNTE: [144],
        },
    };
    case '197': return {
        repositoryId: '64bdf712-b328-5f46-8fd0-b8e67aaf8bec',
        host: 'https://able-group-qas.d-velop.cloud',
        bucketName: 'able-documenttransport-store',
        stage: 'QAS',
        excludeFields: {
            XDPER: ['UPN', 'E-Mail', 'Vorname', 'Name', 'Barcode'],
        },
        uniqueFields: {
            ADEB: [138],
            DKUND: [138],
            AKAUF: [151],
            DKAUF: [151],
            XEVER: [6],
            XRVER: [6],
            AKUNR: [199],
            DKUNR: [199],
            XEVUN: [6],
            XCASE: [83],
            XDCAS: [83],
            ALIEF: [154],
            DLIEA: [154],
            ABEST: [153],
            DLIEB: [153],
            XLEV: [6],
            XLRV: [6],
            ALIRA: [199],
            DLIRD: [199],
            XLVU: [6],
            XPRTN: [34],
            XAPER: [120],
            XDPER: [120],
            AUNTE: [124],
            DUNTE: [124],
        },
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
