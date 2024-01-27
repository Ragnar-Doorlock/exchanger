class GetExchangeRateHttpRequest {
    constructor(request) {
        this.date = request.body.date;
    }
}

module.exports = GetExchangeRateHttpRequest;
