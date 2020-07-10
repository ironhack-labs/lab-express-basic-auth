const express = require('express');
const router = express.Router();
const usercontrollers = require('../controllers/user.controllers')

/* GET home page */
router.get('/signup', usercontrollers.signUp);

router.post('/signup', usercontrollers.createUser)

router.get('/login', usercontrollers.login)

module.exports = router;