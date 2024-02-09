//const CONVERT_REGEXP = /(\d+) ([A-Z]{3}) ([A-Z]{3})/;
const GetExchangeRateCommandValidator = require('./get-exchange-rate/getExchangeRateValidator');
const GetExchangeRateCommandInteractor = require('./get-exchange-rate/getExchangeRateInteractor');
const BotPresenter = require('./botPresenter');
const GetExchangeRateMessage = require('./get-exchange-rate/getExchangeRateMessage');
const GetActualRatesCommandInteractor = require('./get-actual-rates.js/getActualRatesCommandInteractor');
const ConvertCommandValidator = require('./convert-command/convertCommandValidator');
const ConvertCommandInteractor = require('./convert-command/convertCommandInteractor');
const ConvertCommandMessage = require('./convert-command/convertCommandMessage');
const BotError = require('./errors/botError');

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
                presenter.presentFailure( new BotError(error) );
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
                presenter.presentFailure( new BotError(error) );
            }

        });

        await this.telegramBot.onText(/\/convert (.+)/, async (message, match) => {
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
                presenter.presentFailure( new BotError(error) );
            }

        });
    }
}

module.exports = BotController;
