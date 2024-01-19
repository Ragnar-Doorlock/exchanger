class DBProvider {
    constructor({ client }) {
        this.client = client;
    }

    async insert(data) {
        const db = this.client.db(process.env.MONGO_DB);
        const collection = db.collection(process.env.MONGO_COLLECTION);
        await collection.insertOne(data);
    }

    async getData(data) {
        const db = this.client.db(process.env.MONGO_DB);
        const collection = db.collection(process.env.MONGO_COLLECTION);
        return await collection.find(data).toArray();
    }
}

module.exports = DBProvider;
