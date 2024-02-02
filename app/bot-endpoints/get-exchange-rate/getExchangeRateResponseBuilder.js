class GetExchangeRateCommandResponseBuilder {
    build(entity) {
        return `date: ${entity.getDate()}, ` +
            `USD: ${entity.getUSDRate()}, ` +
            `EUR: ${entity.getEURRate()}`;
    }
}

module.exports = GetExchangeRateCommandResponseBuilder;
