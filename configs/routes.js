const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users.controller')
const sessionMiddleware = require('../middlewares/session.middleware')

router.get('/', usersController.login);


router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.login);
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin);
router.get('/signup', usersController.signup);

router.get('/main', sessionMiddleware.isAuthenticated, usersController.goToMainWeb);
router.get('/users/signup', usersController.signup)
router.post('/users/signup', usersController.doCreateUser)


module.exports = router