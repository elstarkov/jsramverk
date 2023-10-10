const express = require('express');
const router = express.Router();

const delayed = require("../models/delayed.js");
const auth = require("../models/auth.js");

router.get('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => delayed.getDelayedTrains(req, res)
);

module.exports = router;
