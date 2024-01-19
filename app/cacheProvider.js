class Cache {
    constructor() {
        this.cache = new Map();
    }

    async set(key, value) {

    }

    async get(key) {
        return await this.cache.get(key);
    }

    async has(key) {
        return await this.cache.has(key);
    }

    async clear() {
        await this.cache.clear();
    }
}

module.exports = Cache;
