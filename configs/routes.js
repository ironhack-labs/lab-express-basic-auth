const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller')

router.get('/', usersController.login)
router.get('/signup', usersController.signup)
router.post('/signup', usersController.createUser)

module.exports = router;
