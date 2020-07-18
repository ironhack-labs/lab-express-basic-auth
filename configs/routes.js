const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const sessionMiddleware = require('../middleware/session.middleware')

router.get('/', sessionMiddleware.isNotAuthenticated, usersController.login)
router.post('/', sessionMiddleware.isNotAuthenticated, usersController.loginPost)
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.login)
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.loginPost)
router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.signup)
router.post('/signup', sessionMiddleware.isNotAuthenticated, usersController.create)
router.post('/logout', usersController.logout)
router.get('/user-hello', usersController.userHello)


module.exports = router