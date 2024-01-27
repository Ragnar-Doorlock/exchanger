class HttpPresenter {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    presentSuccess(response) {
        if (response) {
            this.response.status(200).send(response);
            return;
        }

        this.response.sendStatus(200);
    }

    presentFailure(error) {
        this.response.status(error.httpCode).send({ message: error.message });
    }
}

module.exports = HttpPresenter;
