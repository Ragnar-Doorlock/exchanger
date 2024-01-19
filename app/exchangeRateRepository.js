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
        const result = await this.dbProvider.getData({ date: date });
        if (result.length === 0) {
            return null;
        }
        await this.cache.set(date, JSON.stringify(result));
        return this.exchangerFactory.create({
            USDRate: result.usd,
            EURRate: result.eur,
            date: result.date
        });
    }

    async save(data) {
        await this.dbProvider.insert(data);
        this.cache.clear();
    }

    async updateRates(date) {
        // probably won't be needed
    }
}

module.exports = ExchangeRateRepository;
