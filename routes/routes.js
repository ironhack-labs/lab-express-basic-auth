const express = require('express');
const router = express.Router();
const miscController = require('../controllers/misc.controller')
const usersController = require('../controllers/users.controller')
const secure = require('../middlewares/secure.middleware')
/* GET home page */
router.get('/', miscController.index);

//Registration

router.get('/register', secure.isNotAuthenticated, usersController.register)
router.post('/register',secure.isNotAuthenticated, usersController.doRegister)


//Login

router.get('/login',secure.isNotAuthenticated, usersController.login)
router.post('/login',secure.isNotAuthenticated, usersController.doLogin)

//Logout
router.post('/logout',secure.isAuthenticated, usersController.logout)

//Profile
router.get('/profile',secure.isAuthenticated, usersController.profile)

//Main

router.get('/main', secure.isAuthenticated, usersController.main)

//Private

router.get('/private', secure.isAuthenticated, usersController.private)

module.exports = router;