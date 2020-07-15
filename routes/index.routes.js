const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const sessionMiddleware = require('../middlewares/session.middleware');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', userController.signUp);

router.post('/signup', userController.createUser)

router.get('/login', userController.login)

router.post('/login', userController.doLogin)

module.exports = router;
