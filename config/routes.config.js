const router = require('express').Router();
const authController = require('../controllers/Auth.controller');
const miscController = require('../controllers/Misc.controller');
const userController = require('../controllers/User.controller');
const authMiddlewares = require('../middlewares/authMiddleware');

// MISC 
router.get('/', miscController.home);

// AUTH
router.get('/register', authController.register);
router.post('/register', authController.doRegister);

// LOGIN
router.get('/login', authController.login);
router.post('/login', authController.doLogin);

// USER 
router.get('/profile', userController.profile);

module.exports = router;