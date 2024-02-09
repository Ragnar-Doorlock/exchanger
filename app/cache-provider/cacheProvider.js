class Cache {
    constructor() {
        this.cache = new Map();
    }

    async set(key, value) {
        await this.cache.set(key, value);
    }

    async get(key) {
        return this.cache.get(key);
    }

    async has(key) {
        return this.cache.has(key);
    }

    async clear() {
        await this.cache.clear();
    }

    async entries() {
        await this.cache.entries();
    }
}

module.exports = Cache;
