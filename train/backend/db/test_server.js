

/** JUST FOR TESTING
*
*
/**
* Connect to the database and search using a criteria.
*/
"use strict";

// MongoDB
const database = require('./mongo_database.js');

require('dotenv').config();


// Express server
const port = 1338;
const express = require("express");
const app = express();


// Just for testing the sever
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/list", async (request, response) => {
    const db = await database.getDb();

    try {
        let res = await db.collection.find({}).toArray();

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }

    await db.client.close();
});

app.post("/update", async (request, response) => {
    try {
        const db = await database.getDb();

        const doc = {
            code: "1337",
            trainnumber: "TEST_TRAIN",
            traindate: "24/1337",
        };

        const result = await db.collection.insertOne(doc);

        console.log(`
        Inserted ${result.insertedCount} document with _id: ${result.insertedId}
        `);

        await db.client.close();

        response.status(200).json({ message: "Dokumentet har lagts till i databasen." });
    } catch (error) {
        console.error("Fel vid inlägg i databasen:", error);
        response.status(500).json({ error: "Ett fel inträffade vid inläggning i databasen." });
    }
});


// Startup server and liten on port
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    //console.log(`DSN is: ${dsn}`);
});
