const router = require("express").Router();
const usersController = require('../controllers/users.controller');

// Home
router.get('/', usersController.index);

// Registro
router.get('/new-user', usersController.register);
router.post('/new-user', usersController.doRegister);

// Login
router.get('/login', usersController.login);
router.post('/login', usersController.doLogin);

module.exports = router;