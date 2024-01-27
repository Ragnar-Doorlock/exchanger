const ApiError = require('./apiError');

class ValidationError extends ApiError {
    constructor(message) {
        super({ httpCode: 422, message });
        this.name = this.constructor.name;
    }
}

module.exports = ValidationError;
