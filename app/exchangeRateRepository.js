class ExchangeRateRepository {
    constructor({ dbProvider, exchangerFactory, cache }) {
        this.dbProvider = dbProvider;
        this.exchangerFactory = exchangerFactory;
        this.cache = cache;
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
}

module.exports = ExchangeRateRepository;
