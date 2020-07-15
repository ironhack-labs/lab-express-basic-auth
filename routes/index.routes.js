const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const userController = require('../controllers/user.controllers');

/* GET home page */
router.get('/', userController.deleteAllUsers);

router.get('/signup', userController.showSignUpForm);

router.post('/newUser', userController.createNewUser);


module.exports = router;
