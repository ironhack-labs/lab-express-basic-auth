const express = require('express');
const router = express.Router();

const usersController = require('../controllers/user.controller')
const sessionMiddleware = require('../middlewares/session.middleware')


router.get('/login', usersController.login);
router.post('/login', usersController.doLogin);
router.get('/signup', usersController.signup);
router.post('/users', usersController.createUser);
router.get('/main', sessionMiddleware.auth, usersController.logged)

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

module.exports = router;