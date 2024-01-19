class Exchanger {
    constructor(data) {
        this.USDRate = data.USDRate;
        this.EURRate = data.EURRate;
        this.date = data.date;
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
}

module.exports = Exchanger;
