class DBProvider {
    constructor({ client, db, collection }) {
        this.client = client;
        this.db = db;
        this.collection = collection;
    }

    async insert(data) {
        const db = this.client.db(this.db);
        const collection = db.collection(this.collection);
        await collection.insertOne(data);
    }

    async getData(data) {
        const db = this.client.db(this.db);
        const collection = db.collection(this.collection);
        const result = await collection.find(data).toArray();
        return result;
    }
}

module.exports = DBProvider;
