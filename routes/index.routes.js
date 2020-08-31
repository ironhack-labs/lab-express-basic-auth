const express = require('express');
const router = express.Router();
const {
    showSignIn,
    createUser,
    showLogin,
    showProfile,
    loginProcess
} = require("../controllers/index.js")

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

//SIGNIN
router.get('/', showSignIn)
router.post('/', createUser)

// LOGIN
router.get('/login', showLogin)
router.post('/login', loginProcess)

// PROFILE
router.post('/profile', showProfile)

module.exports = router;
