module.exports = {
    async up(db, client) {
        await db.createCollection('exchanger');
    },

    async down(db, client) {
        await db.collection('exchanger').drop();
    }
};
