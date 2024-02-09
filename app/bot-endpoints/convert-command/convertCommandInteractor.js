const { DateTime } = require('luxon');
const BotValidationError = require('../errors/validationError');

class ConvertCommandInteractor {
    constructor({
        presenter,
        validator,
        exchangeRateRepository,
        exchangeRateProvider,
        convertCommandResponseBuilder,
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.exchangeRateRepository = exchangeRateRepository;
        this.responseBuilder = convertCommandResponseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
    }

    async execute(message) {

        const errors = this.validator.validate(message);

        if (errors.length > 0) {
            //custom error?
            this.presenter.presentFailure( new BotValidationError(errors) );
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
            amount: Number(message.amount),
            from: message.fromCurrency,
            to: message.toCurrency
        });

        this.presenter.presentSuccess(this.responseBuilder.build(result));
    }
}

module.exports = ConvertCommandInteractor;
