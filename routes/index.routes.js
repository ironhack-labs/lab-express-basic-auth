const express = require('express');
const router = express.Router();
const miscController = require('../controllers/misc.controller');
const usersController = require('../controllers/users.controller');
const secure = require('../middlewares/secure.middleware');

/* GET home page */
router.get('/', miscController.home)

router.get('/register', secure.isNotAuthenticated, usersController.register)
router.post('/register', secure.isNotAuthenticated, usersController.doRegister)


router.get('/login', secure.isNotAuthenticated, usersController.login)
router.post('/login', secure.isNotAuthenticated, usersController.doLogin)
router.post('/logout', secure.isAuthenticated, usersController.logout)
router.get('/profile', secure.isAuthenticated, usersController.profile)

module.exports = router;
