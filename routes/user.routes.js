const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users.controller')
const secure = require('../middleware/secure.middleware')
//Iteration 1

router.get('/register',secure.isNotAuthenticated, userControllers.edit)
router.post('/register',secure.isNotAuthenticated,userControllers.doEdit)

//Iteration 2

router.get('/login',secure.isNotAuthenticated,userControllers.login);
router.post('/login',secure.isNotAuthenticated,userControllers.doLogin);
router.get('/profile',secure.isAuthenticated,userControllers.profile)
router.get('/logoff',secure.isAuthenticated,userControllers.logout)
router.get('/private',secure.isNotAuthenticated,userControllers.private)
router.get('/main',secure.isAuthenticated,userControllers.main)

module.exports = router;