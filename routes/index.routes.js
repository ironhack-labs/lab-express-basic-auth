const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const miscController = require('../controllers/misc.controller')
const secure = require('../middlewares/secure.middleware')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
router.get('/register', secure.isNotAuthenticated, userController.register)
router.post('/register', secure.isNotAuthenticated, userController.doRegister)
router.get('/', miscController.home)


router.get('/login', secure.isNotAuthenticated, userController.login)
router.post('/login', secure.isNotAuthenticated, userController.doLogin)

router.post('/logout', secure.isAuthenticated, userController.logout)

router.get('/profile', secure.isAuthenticated, userController.profile)


//Main

router.get('/main', secure.isAuthenticated, userController.main)

//private

router.get('/private', secure.isAuthenticated, userController.private)

module.exports = router;