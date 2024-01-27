class LoggerProvider {
    constructor(log4js) {
        this.log4js = log4js;
    }

    create(name) {
        const logger = this.log4js.getLogger(name);
        return logger;
    }
}

module.exports = LoggerProvider;
