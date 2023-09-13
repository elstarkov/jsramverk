
const database = require('./mongo_database.js');
require('dotenv').config();

(async ()=> {
    await resetCollection();
})();

async function resetCollection() {
    const db = await database.getDb();

    await db.collection.deleteMany();

    await db.client.close();
}
