const database = require('../db/database.js');
const apiKey = "7c99bdeb761844b08e940832abebd446";

const trains = {
    fetchAllDelayedTrains: async function fetchAllDelayedTrains() {
        let db;

        try {
            db = await database.openDb(version);

        } catch(error) {
            return {
                status: error.status,
                message: error.message,
            };
        } finally {
            await db.close();
        }
    }
};

module.exports = {trains, apiKey};