const express = require('express')
const router = express.Router();
const {
    signupPage,
    signup,
    loginPage,
    login
} = require('../controllers/auth');

// Signup form
router.get('/signup', signupPage);
// Create new user in DB
router.post('/signup', signup);

// Login form
router.get('/login', loginPage);
// Login submit
router.post('/login', login)

module.exports = router;