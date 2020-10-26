class ExportSetAlreadyExistingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ExportSetAlreadyExistingError';
        Error.captureStackTrace(this, this.constructor);
        this.status = 400;
    }

    statusCode() {
        return this.status;
    }
}

module.exports = ExportSetAlreadyExistingError;
