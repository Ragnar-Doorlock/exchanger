const { DateTime } = require('luxon');

class GetActualRatesCommandInteractor {
    constructor({
        presenter,
        exchangerFactory,
        exchangeRateRepository,
        responseBuilder,
        exchangeRateProvider
    }) {
        this.presenter = presenter;
        this.exchangerFactory = exchangerFactory;
        this.exchangeRateRepository = exchangeRateRepository;
        this.responseBuilder = responseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
    }

    async execute() {
        const currentDate = DateTime.now().toISODate();
        const rates = await this.exchangeRateRepository.getRateByDate(currentDate);

        if (rates) {
            this.presenter.presentSuccess(this.responseBuilder.build( rates ));
            return;
        }

        const currencyValues = await this.exchangeRateProvider.getHistoricalRates(currentDate);

        const entity = await this.exchangeRateRepository._getEntityWithRates(currencyValues, currentDate);
        this.presenter.presentSuccess(this.responseBuilder.build( entity ));
    }
}

module.exports = GetActualRatesCommandInteractor;
