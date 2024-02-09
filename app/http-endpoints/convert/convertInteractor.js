const ValidationError = require('../errors/validationError');
const { DateTime } = require('luxon');

class ConvertInteractor {
    constructor({
        presenter,
        validator,
        exchangeRateRepository,
        exchangeRateProvider,
        convertResponseBuilder,
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.exchangeRateRepository = exchangeRateRepository;
        this.responseBuilder = convertResponseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const currentDate = DateTime.now().toISODate();
        let rates = await this.exchangeRateRepository.getRateByDate(currentDate);

        if (!rates) {
            const currencyValues = await this.exchangeRateProvider.getActualRates();
            rates = await this.exchangeRateRepository._getEntityWithRates(currencyValues, currentDate);
        }

        const result = await this.exchangeRateProvider.calculateExchangeRate({
            rates: rates.getRates(),
            amount: Number(request.amount),
            from: request.firstCurrency,
            to: request.secondCurrency
        });

        this.presenter.presentSuccess(this.responseBuilder.build(result));
    }
}

module.exports = ConvertInteractor;
