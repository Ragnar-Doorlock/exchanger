const ValidationError = require('../errors/validationError');

class GetExchangeRateInteractor {
    constructor({
        presenter,
        validator,
        exchangerFactory,
        exchangeRateRepository,
        getExchangeRateResponseBuilder,
        loggerProvider,
        exchangeRateProvider,
        dateProvider
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.exchangerFactory = exchangerFactory;
        this.exchangeRateRepository = exchangeRateRepository;
        this.responseBuilder = getExchangeRateResponseBuilder;
        this.logger = loggerProvider.create(GetExchangeRateInteractor.name);
        this.exchangeRateProvider = exchangeRateProvider;
        this.dateProvider = dateProvider;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const rates = await this.exchangeRateRepository.getRateByDate(request.date);
        if (!rates) {
            // probably currency api would work if i request actual rates as historical with current date
            // but let it be that way for now
            let rates;
            if (this.dateProvider.getCurrentDate() === request.date) {
                rates = await this.exchangeRateProvider.getActualRates();
            } else {
                rates = await this.exchangeRateProvider.getHistoricalRates(request.date);
            }
            const resultUSD = await this.exchangeRateProvider.calculateExchangeRate(rates, 'USD');
            const resultEUR = await this.exchangeRateProvider.calculateExchangeRate(rates, 'EUR');
            const entity = this.exchangerFactory.create({
                USDRate: resultUSD,
                EURRate: resultEUR,
                date: request.date
            });

            await this.exchangeRateRepository.save({
                date: request.date,
                usd: resultUSD,
                eur: resultEUR,
                rates
            });
            this.presenter.presentSuccess(this.responseBuilder.build( entity ));
            return;
        }

        const entity = this.exchangerFactory.create({
            USDRate: rates.USDRate,
            EURRate: rates.EURRate,
            date: request.date
        });
        this.presenter.presentSuccess(this.responseBuilder.build( entity ));
    }
}

module.exports = GetExchangeRateInteractor;
