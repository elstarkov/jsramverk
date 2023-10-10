const express = require('express');
const router = express.Router();

const codes = require("../models/codes.js");
const auth = require("../models/auth.js");

router.get('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => codes.getCodes(req, res)
);

module.exports = router;
