class ApiError {
    constructor({ httpCode, message }) {
        this.httpCode = httpCode || 500;
        this.name = 'API Error';
        this.message = message;
    }
}

module.exports = ApiError;
