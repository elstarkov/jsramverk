require('dotenv').config();
const bcrypt = require('bcryptjs');
const database = require('../db/mongo_database.js');
const jwt = require("jsonwebtoken");

const login = {
    loginUser: async function loginUser(req, res) {
        const db = await database.getUsersDb();

        const username = req.body.username;
        const password = req.body.password;

        try {
            const filter = { username: username };

            const user = await db.collection.findOne(filter);

            if (user) {
                return comparePasswords(res, password, user.password);
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Wrong password or username",
                    detail: "Password or username is incorrect."
                }
            });
        } finally {
            await db.client.close();
        }
    }
};

async function comparePasswords(res, inputPassword, hashedPassword) {
    bcrypt.compare(inputPassword, hashedPassword, (err, result) => {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "bcrypt error",
                    detail: "bcrypt error"
                }
            });
        }

        if (result) {
            let payload = { data: "JavaScript är bra" };
            let jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

            return res.status(201).json({
                data: {
                    type: "success",
                    message: "Token created.",
                    user: payload,
                    token: jwtToken
                }
            });
        }

        return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "Wrong password or username",
                detail: "Password or username is incorrect."
            }
        });
    });
}

module.exports = login;
