const DATE_FORMAT = /^[1,2][0-9]{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;
const DateProvider = require('../dateProvider/dateProvider');
const dateProvider = new DateProvider();

class GetExchangeRateValidator {
    validate(request) {
        const errors = [];

        if (!request.date) {
            errors.push('Date is required.');
        } else {
            if (!DATE_FORMAT.test(request.date)) {
                errors.push('Invalid date format.');
            }
            if (dateProvider.convertDate(request.date) > Date.now()) {
                errors.push('Invalid date');
            }
        }

        return errors;
    }
}

module.exports = GetExchangeRateValidator;
