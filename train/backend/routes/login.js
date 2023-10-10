const express = require('express');
const router = express.Router();

const login = require("../models/login.js");

router.post('/', (req, res) => login.loginUser(req, res));

module.exports = router;
