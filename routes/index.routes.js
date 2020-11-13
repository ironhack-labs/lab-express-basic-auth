const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose')
const User     = require('../models/User.model')
const bcrypt   = require('bcryptjs')
const bcryptsalt = 10

/* GET home page */
router.get('/', (req, res, next) => res.render('index'))


module.exports = router;
