class BotPresenter {
    constructor({ message, telegramBot }) {
        this.message = message;
        this.telegramBot = telegramBot;
    }

    presentSuccess(response) {
        if (response) {
            this.telegramBot.sendMessage(this.message.chat.id, response);
            return;
        }

        this.telegramBot.sendMessage(this.message.chat.id, 'Done.');
    }

    presentFailure(error) {
        this.telegramBot.sendMessage(this.message.chat.id, error.message);
    }
}

module.exports = BotPresenter;
