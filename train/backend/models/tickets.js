
const database = require('../db/mongo_database.js');

require('dotenv').config();

const tickets = {
    getTickets: async function getTickets(req, res) {
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

    createTicket: async function createTicket(req, res) {
        const db = await database.getDb();

        try {
            const count = await db.collection.countDocuments();
            const doc = {
                my_id: count + 1,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            };

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
    },

    updateTicket: async function updateTicket(req, res) {
        const db = await database.getDb();

        try {
            const filter = { my_id: req.body.my_id };

            const updateDoc = {
                $set: {
                    code: req.body.code,
                },
            };

            await db.collection.updateOne(filter, updateDoc);

            res.json({ message: 'Uppdatering genomförd' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Något gick fel' });

        } finally {
            await db.client.close();
        }
    }
};

module.exports = tickets;
