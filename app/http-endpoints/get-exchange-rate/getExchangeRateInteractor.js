const ValidationError = require('../../errors/validationError');

class GetExchangeRateInteractor {
    constructor({
        presenter,
        validator,
        exchangerFactory,
        exchangeRateRepository,
        getExchangeRateResponseBuilder,
        exchangeRateProvider
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.exchangerFactory = exchangerFactory;
        this.exchangeRateRepository = exchangeRateRepository;
        this.responseBuilder = getExchangeRateResponseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const rates = await this.exchangeRateRepository.getRateByDate(request.date);

        if (rates) {
            this.presenter.presentSuccess(this.responseBuilder.build( rates ));
            return;
        }

        let currencyValues;
        if (new Date() === new Date(request.date)) {
            currencyValues = await this.exchangeRateProvider.getActualRates();
        } else {
            currencyValues = await this.exchangeRateProvider.getHistoricalRates(request.date);
        }

        const entity = await this.exchangeRateRepository._getEntityWithRates(currencyValues, request.date);
        this.presenter.presentSuccess(this.responseBuilder.build( entity ));
    }
}

module.exports = GetExchangeRateInteractor;
