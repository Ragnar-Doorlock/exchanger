require('dotenv').config();
const express = require('express');
const app = express();
const log4js = require('log4js');
const MongoDBConnection = require('./db/mongoDBConnection');
const client = MongoDBConnection.getInstance();
const fx = require('money');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
log4js.configure({
    appenders: {
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' }
    }
});
const botToken = process.env.BOT_TOKEN;
const telegramBot = new TelegramBot(botToken, { polling: true });
const latestCurrencyUrl = process.env.EXCHANGE_RATES_URL_LATEST;
const historicalCurrencyUrl = process.env.EXCHANGE_RATES_HISTORICAL;
const appId = process.env.EXCHANGE_RATES_APP_ID;
const ExchangerRouterBuilder = require('./app/http-endpoints/exchangerController');
const BotController = require('./app/bot-endpoints/botController');
const DBProvider = require('./db/dbProvider');
const LoggerProvider = require('./app/loggerProvider');
const ExchangeRateProvider = require('./app/exchangeRateProvider');
const ExchangeRateRepository = require('./app/exchangeRateRepository');
const ExchangerFactory = require('./app/entities/exchangerFactory');
const GetExchangeRateResponseBuilder = require('./app/http-endpoints/get-exchange-rate/getExchangeRateResponseBuilder');
const ConvertResponseBuilder = require('./app/http-endpoints/convert/convertResponseBuilder');
const Cache = require('./app/cache-provider/cacheProvider');
const GetExchangeRateCommandResponseBuilder = require('./app/bot-endpoints/get-exchange-rate/getExchangeRateResponseBuilder');
const GetActualRatesCommandResponseBuilder = require('./app/bot-endpoints/get-actual-rates.js/getActualRatesCommandResponseBuilder');
const ConvertCommandResponseBuilder = require('./app/bot-endpoints/convert-command/convertCommandResponseBuilder');

(async () => {
    const loggerProvider = new LoggerProvider(log4js);
    const dbProvider = new DBProvider({
        client,
        db: process.env.MONGO_DB,
        collection: process.env.MONGO_COLLECTION
    });
    const exchangeRateProvider = new ExchangeRateProvider({
        fx,
        axios,
        latestCurrencyUrl,
        historicalCurrencyUrl,
        appId
    });
    const logger = loggerProvider.create('Logger');
    const exchangerFactory = new ExchangerFactory();
    const cache = new Cache();
    const exchangeRateRepository = new ExchangeRateRepository({ dbProvider, exchangerFactory, cache, exchangeRateProvider });
    const getExchangeRateResponseBuilder = new GetExchangeRateResponseBuilder();
    const convertResponseBuilder = new ConvertResponseBuilder();
    const getExchangeRateCommandResponseBuilder = new GetExchangeRateCommandResponseBuilder();
    const getActualRatesCommandResponseBuilder = new GetActualRatesCommandResponseBuilder();
    const convertCommandResponseBuilder = new ConvertCommandResponseBuilder();

    const exchangerRoutes = new ExchangerRouterBuilder({
        express,
        exchangeRateRepository,
        exchangerFactory,
        getExchangeRateResponseBuilder,
        exchangeRateProvider,
        convertResponseBuilder
    });
    const botController = new BotController({
        telegramBot,
        exchangerFactory,
        getExchangeRateCommandResponseBuilder,
        exchangeRateProvider,
        exchangeRateRepository,
        getActualRatesCommandResponseBuilder,
        convertCommandResponseBuilder
    });

    app.use(express.json());
    app.use('/exchanger', exchangerRoutes.createRoutes());
    botController.createCommands();

    app.listen(3000, logger.info('App is running.'));
})();

