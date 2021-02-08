const express = require('express');
const router = express.Router();
const miscController = require('../controllers/misc.controller')
const usersController = require('../controllers/users.controller')

/* GET home page */
router.get('/', miscController.index);

//Registration

router.get('/register', usersController.register)
router.post('/register', usersController.doRegister)


//Login

router.get('/login', usersController.login)
router.post('/login', usersController.doLogin)

//Logout
router.post('/logout', usersController.logout)

//Profile
router.get('/profile', usersController.profile)

module.exports = router;