const currencies = require('../currencies');

class ConvertValidator {
    validate(request) {
        const errors = [];

        if (!request.amount) {
            errors.push('Amount is required.');
        }

        if (!request.firstCurrency) {
            errors.push('First currency is required.');
        } else if (!Object.values(currencies).includes(request.firstCurrency)) {
            errors.push('First currency value should be one of: EUR, USD, UAH.');
        }

        if (!request.secondCurrency) {
            errors.push('Second currency is required.');
        } else if (!Object.values(currencies).includes(request.firstCurrency)) {
            errors.push('Second currency value should be one of: EUR, USD, UAH.');
        }

        return errors;
    }
}

module.exports = ConvertValidator;
