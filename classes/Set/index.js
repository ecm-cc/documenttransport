const configLoader = require('../../global.config');

class Set {
    constructor(req) {
        this.creator = '';
        this.config = configLoader.load(req.get('x-dv-tenant-id'));
        this.httpOptions = {
            headers: {
                Accept: 'application/hal+json',
                'Accept-Language': 'de',
                'Content-Type': 'application/hal+json',
                Cookie: req.headers.cookie,
            },
        };
    }
}

module.exports = Set;
