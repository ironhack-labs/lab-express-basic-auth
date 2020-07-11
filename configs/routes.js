const express = require('express');
const router = express.Router();
const userControler = require('../controllers/user.controller');
const sessionMiddleware = require('../middlewares/session.middleware')


/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/users/signup', sessionMiddleware.isNotAuthenticated, userControler.signup);
router.post('/users/create', sessionMiddleware.isNotAuthenticated, userControler.doSignup);

router.get('/users/login', sessionMiddleware.isNotAuthenticated, userControler.login);
router.post('/users/login', sessionMiddleware.isNotAuthenticated, userControler.doLogin);

router.get('/users/logout', sessionMiddleware.isAuthenticated, userControler.logout);
router.post('/users/logout', sessionMiddleware.isAuthenticated, userControler.doLogout);

router.get('/users/profile', sessionMiddleware.isAuthenticated, userControler.profile);

module.exports = router;