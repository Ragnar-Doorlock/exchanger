const { MongoClient, ServerApiVersion } = require('mongodb');
const connectionUrl = process.env.MONGO_CONNECTION_URL;

class MongoDBConnection {
    constructor() {
        this.client = new MongoClient(connectionUrl, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }

    getInstance() {
        if (this.client) {
            this.client.connect();
            return this.client;
        }

        this.client = new MongoDBConnection();
        return this.client;
    }
}

module.exports = new MongoDBConnection();
