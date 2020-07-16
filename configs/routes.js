const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users.controller')
const sessionMiddleware = require('../middlewares/session.middleware')

router.get('/', usersController.login);


router.get('/login', usersController.login);
router.post("/login", usersController.doLogin);
router.get('/signup', usersController.signup);


router.get('/users/signup', usersController.signup)
router.post('/users/signup', usersController.doCreateUser)


module.exports = router