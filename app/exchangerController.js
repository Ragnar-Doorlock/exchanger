const HttpPresenter = require('./httpPresenter');
const ApiError = require('./errors/apiError');
const GetExchangeRateValidator = require('./get-exchange-rate/getExchangeRateValidator');
const GetExchangeRateInteractor = require('./get-exchange-rate/getExchangeRateInteractor');
const GetExchangeRateHttpRequest = require('./get-exchange-rate/getExchangeRateHttpRequest');

class ExchangerRouterBuilder {
    constructor({
        express,
        exchangeRateRepository,
        exchangerFactory,
        getExchangeRateResponseBuilder,
        loggerProvider,
        exchangeRateProvider,
        dateProvider
    }) {
        this.router = express.Router();
        this.exchangeRateRepository = exchangeRateRepository;
        this.exchangerFactory = exchangerFactory;
        this.getExchangeRateResponseBuilder = getExchangeRateResponseBuilder;
        this.loggerProvider = loggerProvider;
        this.exchangeRateProvider = exchangeRateProvider;
        this.dateProvider = dateProvider;
    }

    createRoutes() {
        this.router.post('/get-rate', async (request, response) => {
            const validator = new GetExchangeRateValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new GetExchangeRateInteractor({
                presenter,
                validator,
                exchangerFactory: this.exchangerFactory,
                exchangeRateRepository: this.exchangeRateRepository,
                getExchangeRateResponseBuilder: this.getExchangeRateResponseBuilder,
                loggerProvider: this.loggerProvider,
                exchangeRateProvider: this.exchangeRateProvider,
                dateProvider: this.dateProvider,
            });

            try {
                await interactor.execute(new GetExchangeRateHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        return this.router;
    }
}

module.exports = ExchangerRouterBuilder;
