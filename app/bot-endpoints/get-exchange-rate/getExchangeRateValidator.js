const DATE_FORMAT = /^[1,2][0-9]{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;

class GetExchangeRateCommandValidator {
    validate(message) {
        const dataToValidate = message.text;
        const errors = [];

        if (!dataToValidate) {
            errors.push('');
        } else if (!DATE_FORMAT.test(dataToValidate)) {
            errors.push('Invalid date format.');
        }

        return errors;
    }
}

module.exports = GetExchangeRateCommandValidator;
