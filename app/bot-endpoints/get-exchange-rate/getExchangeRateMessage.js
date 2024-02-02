class GetExchangeRateMessage {
    constructor(message, match) {
        this.chatId = message.chat.id;
        this.text = match[1];
    }
}

module.exports = GetExchangeRateMessage;
