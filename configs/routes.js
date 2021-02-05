const router = require('express').Router();
const miscController = require('../controllers/misc.controller')
const userController = require('../controllers/user.controller')


/* GET home page */
router.get('/', miscController.home);

/* GET user profile */
router.get('/user/:id', userController.profile);

/* GET user profile */
router.get('/terms-and-conditions', miscController.termsAndConditions);

// SIGNUP
/* GET signup form */
router.get('/auth/signup', userController.signup);

/* POST signup form */
router.post('/auth/signup', userController.doSignup);

// LOGIN
/* GET login form */

/* POST login form */

module.exports = router;