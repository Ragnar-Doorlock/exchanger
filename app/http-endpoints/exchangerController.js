const HttpPresenter = require('./httpPresenter');
const ApiError = require('../errors/apiError');
const GetExchangeRateValidator = require('./get-exchange-rate/getExchangeRateValidator');
const GetExchangeRateInteractor = require('./get-exchange-rate/getExchangeRateInteractor');
const GetExchangeRateHttpRequest = require('./get-exchange-rate/getExchangeRateHttpRequest');
const ConvertHttpRequest = require('./convert/convertHttpRequest');
const ConvertInteractor = require('./convert/convertInteractor');
const ConvertValidator = require('./convert/convertValidator');

class ExchangerRouterBuilder {
    constructor({
        express,
        exchangeRateRepository,
        exchangerFactory,
        getExchangeRateResponseBuilder,
        exchangeRateProvider,
        convertResponseBuilder
    }) {
        this.router = express.Router();
        this.exchangeRateRepository = exchangeRateRepository;
        this.exchangerFactory = exchangerFactory;
        this.getExchangeRateResponseBuilder = getExchangeRateResponseBuilder;
        this.exchangeRateProvider = exchangeRateProvider;
        this.convertResponseBuilder = convertResponseBuilder;
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

        this.router.post('/convert', async (request, response) => {
            const validator = new ConvertValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new ConvertInteractor({
                presenter,
                validator,
                exchangeRateRepository: this.exchangeRateRepository,
                exchangeRateProvider: this.exchangeRateProvider,
                convertResponseBuilder: this.convertResponseBuilder,
                exchangerFactory: this.exchangerFactory
            });

            try {
                await interactor.execute(new ConvertHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        return this.router;
    }
}

module.exports = ExchangerRouterBuilder;
