class GetExchangeRateCommandInteractor {
    constructor({
        presenter,
        validator,
        exchangerFactory,
        exchangeRateRepository,
        responseBuilder,
        exchangeRateProvider
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.exchangerFactory = exchangerFactory;
        this.exchangeRateRepository = exchangeRateRepository;
        this.responseBuilder = responseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
    }

    async execute(message) {
        const errors = this.validator.validate(message);

        if (errors.length > 0) {
            // create some errors for bot?
            this.presenter.presentFailure('validation error');
            return;
        }

        const rates = await this.exchangeRateRepository.getRateByDate(message.text);

        if (rates) {
            this.presenter.presentSuccess(this.responseBuilder.build( rates ));
            return;
        }

        const currencyValues = await this.exchangeRateProvider.getHistoricalRates(message.text);

        const entity = await this.exchangeRateRepository._getEntityWithRates(currencyValues, message.text);
        this.presenter.presentSuccess(this.responseBuilder.build( entity ));
    }
}

module.exports = GetExchangeRateCommandInteractor;
