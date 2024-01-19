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
            return this.exchangerFactory.create({
                USDRate: parsedRates.usd,
                EURRate: parsedRates.eur,
                date: date
            });
        }
        const [result] = await this.dbProvider.getData({ date: date });
        if (!result) {
            return null;
        }
        const stringifiedResult = JSON.stringify(result);
        await this.cache.set(date, stringifiedResult);
        return this.exchangerFactory.create({
            USDRate: result.usd,
            EURRate: result.eur,
            date: result.date,
            rates: result.rates
        });
    }

    async save(data) {
        await this.dbProvider.insert(data);
        this.cache.clear();
    }
}

module.exports = ExchangeRateRepository;
