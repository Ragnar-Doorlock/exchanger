const ValidationError = require('../errors/validationError');

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

        let requestRates;
        if (new Date() === new Date(request.date)) {
            requestRates = await this.exchangeRateProvider.getActualRates();
        } else {
            requestRates = await this.exchangeRateProvider.getHistoricalRates(request.date);
        }
        const resultUSD = await this.exchangeRateProvider.calculateExchangeRate(requestRates, 'USD');
        const resultEUR = await this.exchangeRateProvider.calculateExchangeRate(requestRates, 'EUR');
        const entity = this.exchangerFactory.create({
            USDRate: resultUSD,
            EURRate: resultEUR,
            date: request.date
        });
        await this.exchangeRateRepository.save({
            date: request.date,
            usd: resultUSD,
            eur: resultEUR,
            requestRates
        });
        this.presenter.presentSuccess(this.responseBuilder.build( entity ));
    }
}

module.exports = GetExchangeRateInteractor;
