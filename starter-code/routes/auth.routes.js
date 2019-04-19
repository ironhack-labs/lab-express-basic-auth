const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller')

router.get('/signup', auth.signupForm)
router.post('/signup',auth.signupRegister)

router.get('/login', auth.loginForm)
router.post('/login', auth.loginAttempt)

module.exports = router;