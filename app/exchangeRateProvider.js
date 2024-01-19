const latestCurrencyUrl = process.env.EXCHANGE_RATES_URL_LATEST;
const historicalCurrencyUrl = process.env.EXCHANGE_RATES_HISTORICAL;
const appId = process.env.EXCHANGE_RATES_APP_ID;

class ExchangeRateProvider {
    constructor({ fx, axios }) {
        this.fx = fx;
        this.axios = axios;
    }

    async getActualRates() {
        const result = await this.axios.get(latestCurrencyUrl + '?app_id=' + appId);
        return result.data.rates;
    }

    async getHistoricalRates(date) {
        const result = await this.axios.get(`${historicalCurrencyUrl}${date}.json?app_id=${appId}`);
        return result.data.rates;
    }

    async calculateExchangeRate(rates, currency) {
        try {
            this.fx.base = 'USD';
            this.fx.rates = rates;
            return await this.fx.convert(1, { from: currency, to: 'UAH' });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = ExchangeRateProvider;
