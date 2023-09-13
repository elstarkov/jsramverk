
/* Import and use this to open the database */

const mongo = require("mongodb").MongoClient;
const collectionName = "tickets";

const database = {
    getDb: async function getDb() {
        let dsn = process.env.JSRAMVERK_DSN;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/trains";
        }

        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
            dsn: dsn,
        };
    }
};

module.exports = database;