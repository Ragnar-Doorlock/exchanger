class Exchanger {
    constructor(data) {
        this.USDRate = data.USDRate;
        this.EURRate = data.EURRate;
    }

    getUSDRate() {
        return this.USDRate;
    }

    getEURRate() {
        return this.EURRate;
    }
}

module.exports = Exchanger;