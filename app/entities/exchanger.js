class Exchanger {
    constructor(data) {
        this.USDRate = data.USDRate;
        this.EURRate = data.EURRate;
        this.date = data.date;
        this.currencyValues = data.rates;
    }

    getUSDRate() {
        return this.USDRate;
    }

    getEURRate() {
        return this.EURRate;
    }

    getDate() {
        return this.date;
    }

    getRates() {
        return this.currencyValues;
    }
}

module.exports = Exchanger;
