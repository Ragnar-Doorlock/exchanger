class Exchanger {
    constructor(data) {
        this._USDRate = data.USDRate;
        this._EURRate = data.EURRate;
        this._date = data.date;
        this._currencyValues = data.rates;
    }

    getUSDRate() {
        return this._USDRate;
    }

    getEURRate() {
        return this._EURRate;
    }

    getDate() {
        return this._date;
    }

    getRates() {
        return this._currencyValues;
    }
}

module.exports = Exchanger;
