const currencies = require('./currencies');

class ExchangeRateProvider {
    constructor({
        fx,
        axios,
        latestCurrencyUrl,
        historicalCurrencyUrl,
        appId
    }) {
        this.fx = fx;
        this.axios = axios;
        this.latestCurrencyUrl = latestCurrencyUrl;
        this.historicalCurrencyUrl = historicalCurrencyUrl;
        this.appId = appId;
    }

    async getActualRates() {
        const result = await this.axios.get(this.latestCurrencyUrl + '?app_id=' + this.appId);
        return result.data.rates;
    }

    async getHistoricalRates(date) {
        const result = await this.axios.get(`${this.historicalCurrencyUrl}${date}.json?app_id=${this.appId}`);
        return result.data.rates;
    }

    async calculateExchangeRate({ rates, amount, from, to }) {
        try {
            this.fx.base = currencies.USD;
            this.fx.rates = rates;
            return this.fx.convert(amount, { from, to });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = ExchangeRateProvider;
