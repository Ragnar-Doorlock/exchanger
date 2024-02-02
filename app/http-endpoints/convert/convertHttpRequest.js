class ConvertHttpRequest {
    constructor(request) {
        this.amount = request.body.amount;
        this.firstCurrency = request.body.firstCurrency;
        this.secondCurrency = request.body.secondCurrency;
    }
}

module.exports = ConvertHttpRequest;
