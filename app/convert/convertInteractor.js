const ValidationError = require('../errors/validationError');
const { DateTime } = require('luxon');
const currencies = require('../currencies');

class ConvertInteractor {
    constructor({
        presenter,
        validator,
        exchangeRateRepository,
        exchangeRateProvider,
        convertResponseBuilder,
        exchangerFactory
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.exchangeRateRepository = exchangeRateRepository;
        this.responseBuilder = convertResponseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
        this.exchangerFactory = exchangerFactory;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const currentDate = DateTime.now().toString().split('T')[0];
        let rates = await this.exchangeRateRepository.getRateByDate(currentDate);

        if (!rates) {
            const currencyValues = await this.exchangeRateProvider.getActualRates();
            const amountToConvert = 1;
            const resultUSD = await this.exchangeRateProvider.calculateExchangeRate(
                currencyValues,
                amountToConvert,
                currencies.USD,
                currencies.UAH
            );
            const resultEUR = await this.exchangeRateProvider.calculateExchangeRate(
                currencyValues,
                amountToConvert,
                currencies.EUR,
                currencies.UAH
            );
            await this.exchangeRateRepository.save({
                date: currentDate,
                usd: resultUSD,
                eur: resultEUR,
                currencyValues
            });
            rates = this.exchangerFactory.create({
                USDRate: resultUSD,
                EURRate: resultEUR,
                date: currentDate,
                rates: currencyValues
            });
        }

        const result = await this.exchangeRateProvider.calculateExchangeRate(
            rates.getRates(),
            Number(request.amount),
            request.firstCurrency,
            request.secondCurrency
        );

        this.presenter.presentSuccess(this.responseBuilder.build(result));
    }
}

module.exports = ConvertInteractor;
