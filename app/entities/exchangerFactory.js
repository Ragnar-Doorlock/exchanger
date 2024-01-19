const Exchanger = require('./exchanger');

class ExchangerFactory {
    create(data) {
        return new Exchanger(data);
    }
}

module.exports = ExchangerFactory;
