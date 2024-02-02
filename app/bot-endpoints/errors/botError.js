class BotError {
    constructor({ message }) {
        this.name = 'Bot Error';
        this.message = message;
    }
}

module.exports = BotError;
