const express = require('express');
const router = express.Router();

const register = require("../models/register.js");

router.post('/', (req, res) => register.newUser(req, res));

module.exports = router;
