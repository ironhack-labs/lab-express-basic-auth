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
router.get('/login', authMiddlewares.isNotAuthenticated, authController.login);
router.post('/login', authMiddlewares.isNotAuthenticated, authController.doLogin);

// LOGOUT
router.get('/logout', authMiddlewares.isAuthenticated, authController.logout);

// USER 
router.get('/profile', authMiddlewares.isAuthenticated, userController.profile);

module.exports = router;