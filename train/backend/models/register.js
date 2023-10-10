require('dotenv').config();
const bcrypt = require('bcryptjs');
const database = require('../db/mongo_database.js');

const register = {
    newUser: async function newUser(req, res) {
        const db = await database.getUsersDb();

        const username = req.body.username;
        const password = req.body.password;

        try {
            const userToCheck = { username: username };
            const existingUser = await db.collection.findOne(userToCheck);

            if (existingUser) {
                return res.status(403).json({
                    errors: {
                        status: 403,
                        source: "/register",
                        title: "User already exists!",
                        detail: "User already exists in request"
                    }
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const doc = {
                username: username,
                password: hashedPassword,
            };

            await db.collection.insertOne(doc);

            return res.status(201).json({
                data: {
                    message: "User registered successfully",
                }
            });
        } finally {
            await db.client.close();
        }
    }
};

module.exports = register;
