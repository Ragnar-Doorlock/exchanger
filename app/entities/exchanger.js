class Exchanger {
    constructor(data) {
        this.USDRate = data.USDRate;
        this.EURRate = data.EURRate;
        this.date = data.date;
        this.rates = data.rates;
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
        return this.rates;
    }
}

module.exports = Exchanger;
