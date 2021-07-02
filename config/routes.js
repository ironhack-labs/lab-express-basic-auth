const router = require("express").Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Home
router.get('/', usersController.index);

// Registro
router.get('/new-user', usersController.register);
router.post('/new-user', usersController.doRegister);

// Login
router.get('/login', usersController.login);
router.post('/login', usersController.doLogin);

// Profile
router.get('/profile', usersController.profile);

// Logout
router.post('/logout', usersController.logout);

// Main
router.get('/main', usersController.main);


module.exports = router;