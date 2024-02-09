const currencies = require('./currencies');

class ExchangeRateRepository {
    constructor({
        dbProvider,
        exchangerFactory,
        cache,
        exchangeRateProvider
    }) {
        this.dbProvider = dbProvider;
        this.exchangerFactory = exchangerFactory;
        this.cache = cache;
        this.exchangeRateProvider = exchangeRateProvider;
    }

    async getRateByDate(date) {
        const isRateCached = await this.cache.has(date);
        if (isRateCached) {
            const rates = await this.cache.get(date);
            const parsedRates = JSON.parse(rates);
            const result = this.exchangerFactory.create({
                USDRate: parsedRates.usd,
                EURRate: parsedRates.eur,
                date: date,
                rates: parsedRates.currencyValues
            });
            return result;
        }
        const [dbResult] = await this.dbProvider.getData({ date: date });
        if (!dbResult) {
            return null;
        }
        const stringifiedResult = JSON.stringify(dbResult);
        await this.cache.set(date, stringifiedResult);
        const result = this.exchangerFactory.create({
            USDRate: dbResult.usd,
            EURRate: dbResult.eur,
            date: dbResult.date,
            rates: dbResult.currencyValues
        });
        return result;
    }

    async save(data) {
        await this.dbProvider.insert(data);
        this.cache.clear();
    }

    async _getEntityWithRates(currencyValues, date) {
        const amountToConvert = 1;

        const resultUSD = await this.exchangeRateProvider.calculateExchangeRate({
            rates: currencyValues,
            amount: amountToConvert,
            from: currencies.USD,
            to: currencies.UAH
        });
        const resultEUR = await this.exchangeRateProvider.calculateExchangeRate({
            rates: currencyValues,
            amount: amountToConvert,
            from: currencies.EUR,
            to: currencies.UAH
        });
        const entity = this.exchangerFactory.create({
            USDRate: resultUSD,
            EURRate: resultEUR,
            date: date,
            rates: currencyValues
        });
        await this.save({
            date: date,
            usd: resultUSD,
            eur: resultEUR,
            currencyValues
        });

        return entity;
    }
}

module.exports = ExchangeRateRepository;
