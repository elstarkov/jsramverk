
const database = require('../db/mongo_database.js');

require('dotenv').config();

const tickets = {
    getTickets: async function getTickets(req, res) {
        const db = await database.getDb();

        try {
            var allTickets = await db.collection.find({}).toArray();

            if (res) { //Probably better to create a function specifically for websocket...
                return res.json({
                    data: allTickets
                });
            }

            return allTickets;
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
    },

    updateExistingTicket: async function updateExistingTicket(dataObj) {
        const db = await database.getDb();

        try {
            const filter = { my_id: dataObj.my_id };

            const updateDoc = {
                $set: {
                    code: dataObj.code,
                },
            };

            await db.collection.updateOne(filter, updateDoc);

            return "OK";
        } catch (error) {
            console.error(error);
            return "NOT OK";
        } finally {
            await db.client.close();
        }
    },

    createNewTicket: async function createNewTicket(dataObj) {
        const db = await database.getDb();

        try {
            const count = await db.collection.countDocuments();
            const doc = {
                my_id: count + 1,
                code: dataObj.code,
                trainnumber: dataObj.trainnumber,
                traindate: dataObj.traindate,
            };

            await db.collection.insertOne(doc);

            return doc;
        } finally {
            await db.client.close();
        }
    },

    manageTickets: async function manageTickets(namespace) {
        let tickets = await this.getTickets();

        tickets.map(ticket => {
            ticket.locked = false;
            return ticket;
        });

        namespace.on('connection', async (socket) => {
            console.log(`A user connected with socket id: ${socket.id}`);

            socket.on('disconnect', (reason) => {
                console.log(`${reason}`);
                console.log(`Socket with the following id is now closing: ${socket.id}`);
                socket.disconnect();
            });

            socket.emit('tickets', tickets);

            socket.on('locked', (id) => {
                tickets.forEach((ticket) => {
                    if ( ticket.my_id === id ) {
                        ticket.locked = true;
                    }
                });

                namespace.emit('tickets', tickets);
            });

            socket.on('unlocked', (id) => {
                tickets.forEach((ticket) => {
                    if ( ticket.my_id === id ) {
                        ticket.locked = false;
                    }
                });

                namespace.emit('tickets', tickets);
            });

            socket.on('update', async (data) => {
                const res = await this.updateExistingTicket(data);

                if (res === 'OK') {
                    tickets.forEach((ticket) => {
                        if ( ticket.my_id === data.my_id ) {
                            ticket.code = data.code;
                        }
                    });
                }
                socket.emit('updated', res);
            });

            socket.on('create', async (data) => {
                const ticket = await this.createNewTicket(data);

                ticket.locked = false;

                tickets = [
                    ...tickets,
                    ticket
                ];

                namespace.emit('tickets', tickets);
            });
        });
    },
};

module.exports = tickets;
