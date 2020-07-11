const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const sessionMiddlewares = require('../middleware/session.middleware')

router.get('/login', usersController.login);
router.post('/login', usersController.loginPost);
router.get('/signup', usersController.signup);
router.post('/signup', usersController.create)

module.exports = router