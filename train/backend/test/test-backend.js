
/* global it describe before after beforeEach afterEach */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

const dsn = "mongodb://localhost:27017/trains";

process.env.JSRAMVERK_DSN = dsn;

const socketIO = require('socket.io-client');

const port = 3000;

const database = require("../db/mongo_database.js");
const fetchTrainPositions = require("../models/trains.js");

let db;

before(async () => {
    db = await database.getDb();
});

after(async () => {
    await db.collection.deleteMany();
    await db.client.close();
});

describe('app', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH getting base', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a("string");
                    res.body.data.length.should.be.above(0);
                    done();
                });
        });
    });

    describe('app', () => {
        describe('GET /delayed', () => {
            it('200 HAPPY PATH getting base', (done) => {
                chai.request(server)
                    .get("/delayed")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        done();
                    });
            });
        });
    });

    describe('app', () => {
        describe('GET /codes', () => {
            it('200 HAPPY PATH getting base', (done) => {
                chai.request(server)
                    .get("/codes")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        done();
                    });
            });
        });
    });

    describe('app', () => {
        describe('GET /tickets', () => {
            it('200 HAPPY PATH getting base', (done) => {
                chai.request(server)
                    .get("/tickets")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        res.body.data.should.be.an("array");
                        done();
                    });
            });
        });
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

    // describe('fetchTrainPositions', function() {
    //     describe('Test that train objects are returned:', () => {
    //         let client;
    //         let isDone = false;

    //         before(function(done) {
    //             server.listen(port, () => {
    //                 console.log(`Test server listening on port ${port}`);
    //                 done();
    //             });
    //         });

    //         after(function(done) {
    //             server.close(() => {
    //                 console.log('Test server closed');
    //                 done();
    //             });
    //         });

    //         beforeEach(function() {
    //             client = socketIO(`http://127.0.0.1:${port}`, {
    //                 transports: ['websocket'],
    //                 forceNew: true,
    //             });
    //         });

    //         afterEach(function() {
    //             client.close();
    //         });

    //         it('should emit a message to clients', function(done) {
    //             client.on('message', function(data) {
    //                 data.should.be.an("object");

    //                 if (!isDone) {
    //                     isDone = true;
    //                     done();
    //                 }
    //             });

    //             fetchTrainPositions(server);
    //         });
    //     });
    // });
});
