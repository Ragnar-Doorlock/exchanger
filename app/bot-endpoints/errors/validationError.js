const BotError = require('./botError');

class BotValidationError extends BotError {
    constructor(message) {
        super({ message });
        this.name = this.constructor.name;
    }
}

module.exports = BotValidationError;
