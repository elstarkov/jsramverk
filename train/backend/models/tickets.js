
const database = require('../db/mongo_database.js');
require('dotenv').config();

const tickets = {
    getTickets: async function getTickets(req, res){
        const db = await database.getDb();

        try {
            var allTickets = await db.collection.find({}).toArray();

            return res.json({
                data: allTickets
            });
        } finally {
            await db.client.close();
        }
    },

    createTicket: async function createTicket(req, res){
        const db = await database.getDb();

        try {
            const count = await db.collection.countDocuments();
            const doc = {
                my_id: count + 1,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }

            await db.collection.insertOne(doc);

            return res.json({
                data: {
                    my_id: count + 1,
                    code: req.body.code,
                    trainnumber: req.body.trainnumber,
                    traindate: req.body.traindate,
                }
            });
        } finally {
            await db.client.close();
        }
    }
};

module.exports = tickets;
