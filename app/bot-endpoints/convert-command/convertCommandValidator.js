const ONLY_NUMBERS_REGEXP = /^[0-9]+$/;
const currencies = require('../../currencies');

class ConvertCommandValidator {
    validate(message) {
        const errors = [];

        if (!message.amount) {
            errors.push('Amount is required');
        } else if (!ONLY_NUMBERS_REGEXP.test(message.amount)) {
            errors.push('Amount should be only as positive number');
        }

        if (!message.fromCurrency) {
            errors.push('Currency to convert from is required');
        } else if (!Object.values(currencies).includes(message.fromCurrency)) {
            errors.push('Currency value to convert from should be one of: EUR, USD, UAH.');
        }

        if (!message.toCurrency) {
            errors.push('Currency to convert to is required');
        } else if (!Object.values(currencies).includes(message.toCurrency)) {
            errors.push('Currency value to convert to should be one of: EUR, USD, UAH.');
        }

        return errors;
    }
}

module.exports = ConvertCommandValidator;
