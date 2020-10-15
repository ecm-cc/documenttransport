function load(tenant) {
    switch (tenant) {
    case '14q': return {
        repositoryId: '1a2cde3f-2913-3dc2-4a2e-e623459ac23a',
        processId: 'Process_inquiry',
        host: 'https://able-group-dev.d-velop.cloud',
        regEx: 'D[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]',
        caseDocumentId: 'XDCAS',
        caseNumberId: '39',
    };
    case '197': return {
        repositoryId: '64bdf712-b328-5f46-8fd0-b8e67aaf8bec',
        processId: 'Process_inquiry',
        host: 'https://able-group-qas.d-velop.cloud',
        regEx: 'Q[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]',
        caseDocumentId: 'XDCAS',
        caseNumberId: '83',
    };
    case '1ha': return {
        repositoryId: '576583f0-8cd0-5796-bc94-e49426e7bbfb',
        processId: 'Process_inquiry',
        host: 'https://able-group-version.d-velop.cloud',
        regEx: 'P[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]',
        caseDocumentId: 'XDCAS',
        caseNumberId: '84',
    };
    // Default: Prod
    default: return {
        repositoryId: '16d943a8-4683-5ffb-b564-f3bf1903a967',
        processId: 'Process_inquiry',
        host: 'https://able-group.d-velop.cloud',
        regEx: 'P[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]',
        caseDocumentId: 'XDCAS',
        caseNumberId: '84',
    };
    }
}

module.exports = {
    load,
};
