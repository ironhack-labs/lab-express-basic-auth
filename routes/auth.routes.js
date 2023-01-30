const router = require("express").Router();
const authController = require('../controllers/auth.controller')

router.get('/signup',authController.isNotAuthenticated, authController.signup)
router.post('/signup', authController.doSignup)

router.get('/login', authController.isNotAuthenticated, authController.login)
router.post('/login', authController.isNotAuthenticated, authController.doLogin)

router.get('/profile', authController.isAuthenticated, authController.profile)

module.exports = router;