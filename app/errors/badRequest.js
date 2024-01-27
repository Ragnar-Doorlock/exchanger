const ApiError = require('./apiError');

class BadRequest extends ApiError {
    constructor(message) {
        super({ httpCode: 400, message });
        this.name = this.constructor.name;
    }
}

module.exports = BadRequest;
