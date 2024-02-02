//const CONVERT_REGEXP = /(\d+) ([A-Z]{3}) ([A-Z]{3})/;
const GetExchangeRateCommandValidator = require('./get-exchange-rate/getExchangeRateValidator');
const GetExchangeRateCommandInteractor = require('./get-exchange-rate/getExchangeRateInteractor');
const BotPresenter = require('./botPresenter');
const GetExchangeRateMessage = require('./get-exchange-rate/getExchangeRateMessage');
const GetActualRatesCommandInteractor = require('./get-actual-rates.js/getActualRatesCommandInteractor');
const ConvertCommandValidator = require('./convert-command/convertCommandValidator');
const ConvertCommandInteractor = require('./convert-command/convertCommandInteractor');
const ConvertCommandMessage = require('./convert-command/convertCommandMessage');

class BotController {
    constructor({
        telegramBot,
        exchangerFactory,
        getExchangeRateCommandResponseBuilder,
        exchangeRateProvider,
        convertCommandResponseBuilder,
        exchangeRateRepository,
        getActualRatesCommandResponseBuilder,
    }) {
        this.telegramBot = telegramBot;
        this.exchangerFactory = exchangerFactory;
        this.getExchangeRateCommandResponseBuilder = getExchangeRateCommandResponseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
        this.convertCommandResponseBuilder = convertCommandResponseBuilder;
        this.exchangeRateRepository = exchangeRateRepository;
        this.getActualRatesCommandResponseBuilder = getActualRatesCommandResponseBuilder;
        this.convertCommandResponseBuilder = convertCommandResponseBuilder;
    }

    async createCommands() {
        await this.telegramBot.onText(/\/rates (.+)/, async (message, match) => {
            const validator = new GetExchangeRateCommandValidator();
            const presenter = new BotPresenter({
                message,
                telegramBot: this.telegramBot
            });
            const interactor = new GetExchangeRateCommandInteractor({
                validator,
                presenter,
                exchangerFactory: this.exchangerFactory,
                exchangeRateRepository: this.exchangeRateRepository,
                responseBuilder: this.getExchangeRateCommandResponseBuilder,
                exchangeRateProvider: this.exchangeRateProvider
            });
            try {
                await interactor.execute( new GetExchangeRateMessage(message, match) );
            } catch (error) {
                presenter.presentFailure(error.message);
                //this.logger.error(error.message);
            }
        });

        await this.telegramBot.onText(/\/today/, async (message) => {
            const presenter = new BotPresenter({
                message,
                telegramBot: this.telegramBot
            });
            const interactor = new GetActualRatesCommandInteractor({
                presenter,
                exchangerFactory: this.exchangerFactory,
                exchangeRateRepository: this.exchangeRateRepository,
                responseBuilder: this.getActualRatesCommandResponseBuilder,
                exchangeRateProvider: this.exchangeRateProvider
            });
            try {
                await interactor.execute();
            } catch (error) {
                presenter.presentFailure(error.message);
            }

        });

        await this.telegramBot.onText(/\/convert (.+)/, async (message, match) => {
            /* const chatId = message.chat.id;
            const dataFromMessage = match[1].match(CONVERT_REGEXP);

            try {
                if (!Object.values(currencies).includes(dataFromMessage[2])) {
                    this.telegramBot.sendMessage(chatId, 'First currency is invalid, please use UAH/USD/EUR');
                    return;
                }
                if (!Object.values(currencies).includes(dataFromMessage[3])) {
                    this.telegramBot.sendMessage(chatId, 'Second currency is invalid, please use UAH/USD/EUR');
                    return;
                }
                const result = await this.axios.post(convertCurrencyUrl, {
                    amount: dataFromMessage[1],
                    firstCurrency: dataFromMessage[2],
                    secondCurrency: dataFromMessage[3]
                });
                this.telegramBot.sendMessage(chatId, `By converting ${dataFromMessage[1]} ${dataFromMessage[2]}` +
                ` you will get ${result.data.result} ${dataFromMessage[3]}`);
            } catch (error) {
                this.telegramBot.sendMessage(chatId, 'Something went wrong');
                this.logger.error(error.message);
            } */
            const presenter = new BotPresenter({
                message,
                telegramBot: this.telegramBot
            });
            const validator = new ConvertCommandValidator();
            const interactor = new ConvertCommandInteractor({
                presenter,
                validator,
                exchangeRateRepository: this.exchangeRateRepository,
                exchangeRateProvider: this.exchangeRateProvider,
                convertCommandResponseBuilder: this.convertCommandResponseBuilder,
            });

            try {
                await interactor.execute( new ConvertCommandMessage(message, match) );
            } catch (error) {
                presenter.presentFailure(error.message);
            }

        });
    }
}

module.exports = BotController;
