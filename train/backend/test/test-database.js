/* global it describe */

// * ---------- IMPORTANT ---------------------
//
// * Make sure NODE_ENV in .env is set to "test"
// * and that the local test database is not empty
//

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

const dsn = "mongodb://localhost:27017/trains";
process.env.JSRAMVERK_DSN = dsn;

const database = require("../db/mongo_database.js");

before(async () => {
    db = await database.getDb();
});

after(async () => {
    await db.collection.deleteMany();
    await db.client.close();
});


describe('app', () => {
    describe('POST /tickets', () => {
        it('should create a new ticket', async () => {
            const doc = {
                code: "1337",
                trainnumber: "TEST_TRAIN",
                traindate: "24/1337",
            };

            const res = await chai.request(server)
                .post('/tickets')
                .send(doc);

            res.should.have.status(200);
            res.body.should.be.an('object');

        });
    });
});

