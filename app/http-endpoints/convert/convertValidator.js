const ONLY_NUMBERS_REGEXP = /^[0-9]+$/;
const currencies = require('../../currencies');

class ConvertValidator {
    validate(request) {
        const errors = [];

        if (!request.amount) {
            errors.push('Amount is required.');
        } else if (ONLY_NUMBERS_REGEXP.test(request.amount)) {
            errors.push('Amount should contain only numbers.');
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
