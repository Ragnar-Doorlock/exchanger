class GetExchangeRateResponseBuilder {
    build(entity) {
        return {
            date: entity.date,
            USDRate: entity.USDRate,
            EURRate: entity.EURRate
        };
    }
}

module.exports = GetExchangeRateResponseBuilder;
