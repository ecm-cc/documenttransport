class DownloadNotAllowedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DownloadNotAllowedError';
        Error.captureStackTrace(this, this.constructor);
        this.status = 403;
    }

    statusCode() {
        return this.status;
    }
}

module.exports = DownloadNotAllowedError;
