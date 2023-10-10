const express = require('express');
const router = express.Router();

const tickets = require("../models/tickets.js");
const auth = require("../models/auth.js");

router.get('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => tickets.getTickets(req, res)
);

router.post('/', (req, res) => tickets.createTicket(req, res));

router.put('/', (req, res) => tickets.updateTicket(req, res));

module.exports = router;
