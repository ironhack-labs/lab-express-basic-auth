const express = require('express');
const mongoose  = require('mongoose');
const router = express.Router();
const User = require("../models/User.model")
const userControllers = require("../controllers/User.controller")
const miscControllers = require ("../controllers/misc.controller")

/* GET home page */
router.get('/', miscControllers.index);

/* Register page */

router.get('/register', userControllers.register)

router.post('/register', userControllers.doRegister)

module.exports = router;
