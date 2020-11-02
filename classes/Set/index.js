const loadHTTPOptions = require('@ablegroup/httpoptions');
const configLoader = require('../../global.config');

class Set {
    constructor(req) {
        this.creator = '';
        this.tenant = req.get('x-dv-tenant-id');
        this.config = configLoader.load(this.tenant);
        this.httpOptions = loadHTTPOptions(req);
    }
}

module.exports = Set;
