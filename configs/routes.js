const router = require('express').Router();
const { Router } = require('express');
const miscController = require('../controllers/misc.controller');
const userController = require('../controllers/user.controller');
const secure = require('../middlewares/secure.middleware');


/* GET home page */
router.get('/', miscController.home);

/* GET user profile */
router.get('/users/userProfile', secure.isAuthenticated, userController.profile);

/* GET user profile */
router.get('/terms-and-conditions', secure.isNotAuthenticated, miscController.termsAndConditions);

// SIGNUP
/* GET signup form */
router.get('/signup', secure.isNotAuthenticated, userController.signup);

/* POST signup form */
router.post('/signup', secure.isNotAuthenticated, userController.doSignup);

// LOGIN
/* GET login form */
router.get('/login', secure.isNotAuthenticated, userController.login);

/* POST login form */
router.post('/login', secure.isNotAuthenticated, userController.doLogin);

// LOGOUT
/* POST login form */
router.post('/logout', secure.isAuthenticated, userController.logout)

// REMOVE USERS
/* POST remove user profile */
router.post('/users/:id/delete', secure.isAuthenticated, userController.delete);

// PROTECTED ROUTES
/* GET main page */
router.get('/protected/main', secure.isAuthenticated, miscController.main)

/* GET private page */
router.get('/protected/private', secure.isAuthenticated, miscController.private)

module.exports = router;