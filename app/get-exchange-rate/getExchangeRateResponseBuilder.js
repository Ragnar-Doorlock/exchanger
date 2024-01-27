class GetExchangeRateResponseBuilder {
    build(entity) {
        return {
            date: entity.getDate(),
            USDRate: entity.getUSDRate(),
            EURRate: entity.getEURRate()
        };
    }
}

module.exports = GetExchangeRateResponseBuilder;
