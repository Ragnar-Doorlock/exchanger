class GetActualRatesCommandResponseBuilder {
    build(entity) {
        return `Today: ${entity.getDate()}, ` +
            `USD: ${entity.getUSDRate()}, ` +
            `EUR: ${entity.getEURRate()}`;
    }
}

module.exports = GetActualRatesCommandResponseBuilder;
