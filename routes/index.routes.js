const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');

const User = require('../models/User.model');
const { route } = require('./users.routes');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

/* GET session */
router.get('/session', (req, res, next) => res.render('session'))

module.exports = router;
