const express = require('express');
const router = express.Router();
const usercontrollers = require('../controllers/user.controllers')
const sessionMiddleware = require('../middlewares/session.middlewares')

/* GET home page */
router.get('/', usercontrollers.index);
router.get('/signup', sessionMiddleware.isNotAuthenticated, usercontrollers.signUp);
router.post('/signup', sessionMiddleware.isNotAuthenticated, usercontrollers.createUser)
router.get('/login', usercontrollers.login)
router.post('/login', usercontrollers.doLogin)
router.post('/logout', sessionMiddleware.isAuthenticated, usercontrollers.logout)
router.get('/main', sessionMiddleware.isAuthenticated, usercontrollers.main)
router.get('/private', sessionMiddleware.isAuthenticated, usercontrollers.private)


module.exports = router;