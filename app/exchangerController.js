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
        exchangeRateProvider
    }) {
        this.router = express.Router();
        this.exchangeRateRepository = exchangeRateRepository;
        this.exchangerFactory = exchangerFactory;
        this.getExchangeRateResponseBuilder = getExchangeRateResponseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
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
                exchangeRateProvider: this.exchangeRateProvider
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
