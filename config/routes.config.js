const router = require('express').Router();
const authController = require('../controllers/Auth.controller');
const miscController = require('../controllers/Misc.controller');
const userController = require('../controllers/User.controller');

// MISC 
router.get('/', miscController.home);

// AUTH
router.get('/register', authController.register);
router.post('/register', authController.doRegister);

// USER 
router.get('/profile', userController.profile);

module.exports = router;