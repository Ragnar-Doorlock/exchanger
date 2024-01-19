require('dotenv').config();
const express = require('express');
const app = express();
const log4js = require('log4js');
const MongoDBConnection = require('./db/mongoDBConnection');
const client = MongoDBConnection.getInstance();
const fx = require('money');
const axios = require('axios');
log4js.configure({
    appenders: {
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' }
    }
});
const DateProvider = require('./app/dateProvider/dateProvider');
const ExchangerRouterBuilder = require('./app/exchangerController');
const DBProvider = require('./db/dbProvider');
const LoggerProvider = require('./app/loggerProvider');
const ExchangeRateProvider = require('./app/exchangeRateProvider');
const ExchangeRateRepository = require('./app/exchangeRateRepository');
const ExchangerFactory = require('./app/entities/exchangerFactory');
const GetExchangeRateResponseBuilder = require('./app/get-exchange-rate/getExchangeRateResponseBuilder');
const Cache = require('./app/cacheProvider');

(async () => {
    const loggerProvider = new LoggerProvider(log4js);
    const dateProvider = new DateProvider();
    const dbProvider = new DBProvider({ client });
    const exchangeRateProvider = new ExchangeRateProvider({ fx, axios });
    const logger = loggerProvider.create('Logger');
    const exchangerFactory = new ExchangerFactory();
    const cache = new Cache();
    const exchangeRateRepository = new ExchangeRateRepository({ dbProvider, exchangerFactory, cache });
    const getExchangeRateResponseBuilder = new GetExchangeRateResponseBuilder();

    const exchangerRoutes = new ExchangerRouterBuilder({
        express,
        exchangeRateRepository,
        exchangerFactory,
        getExchangeRateResponseBuilder,
        loggerProvider,
        exchangeRateProvider,
        dateProvider
    });

    app.use(express.json());
    app.use('/exchanger', exchangerRoutes.createRoutes());

    app.listen(3000, logger.info('App is running.'));
})();

