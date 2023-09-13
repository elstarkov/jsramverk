
/* global it describe */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

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
                        res.body.data.should.be.an("array");
                        res.body.data.length.should.be.above(0);
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
                        res.body.data.should.be.an("array");
                        res.body.data.length.should.be.above(0);
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
                        res.body.data.length.should.be.above(0);
                        done();
                    });
            });
        });
    });
});
