module.exports = {
    async up(db) {
        await db.createCollection('exchanger');
    },

    async down(db) {
        await db.collection('exchanger').drop();
    }
};
