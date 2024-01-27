const ApiError = require('./apiError');

class NotFound extends ApiError {
    constructor(message) {
        super({ httpCode: 404, message });
        this.name = this.constructor.name;
    }
}

module.exports = NotFound;
