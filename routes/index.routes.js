const express = require('express');
const router = express.Router();
const sessionMiddleware = require('../middlewarea/session.middleware')

const User = require('../models/User.model');
const { route } = require('./users.routes');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

/* GET session */
router.get('/session', sessionMiddleware.isAuthenticated, (req, res, next) => res.render('session'))

module.exports = router;
