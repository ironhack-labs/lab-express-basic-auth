const express = require('express');
const mongoose  = require('mongoose');
const router = express.Router();
const User = require("../models/User.model")
const userControllers = require("../controllers/User.controller")
const miscControllers = require("../controllers/misc.controller")
const secure = require ('../middlewares/secure.middleware')

/* GET home page */
router.get('/', miscControllers.index);

/* Register page */

router.get('/register', secure.isNotAuthenticated, userControllers.register)

router.post('/register', secure.isNotAuthenticated, userControllers.doRegister)

router.get('/login', secure.isNotAuthenticated, userControllers.login)

router.post('/login', secure.isNotAuthenticated, userControllers.doLogin)

router.get('/profile', secure.isAuthenticated, userControllers.profile)

router.post('/logout', secure.isAuthenticated, userControllers.logout)

router.get('/main', secure.isAuthenticated, userControllers.main)

router.get('/private', secure.isAuthenticated, userControllers.private)

module.exports = router;
