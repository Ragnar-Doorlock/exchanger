const CONVERT_REGEXP = /(\d+) ([A-Z]{3}) ([A-Z]{3})/;

// this one can fail if amount was missed in command
class ConvertCommandMessage {
    constructor(message, match) {
        this.chatId = message.chat.id;
        this.amount = match[1].match(CONVERT_REGEXP)[1];
        this.fromCurrency = match[1].match(CONVERT_REGEXP)[2];
        this.toCurrency = match[1].match(CONVERT_REGEXP)[3];
    }
}

// but this one doesn't fix that problem
/* class ConvertCommandMessage {
    constructor(message, match) {
        this.chatId = message.chat.id;
        this.text = match[1];
    }
} */

module.exports = ConvertCommandMessage;
