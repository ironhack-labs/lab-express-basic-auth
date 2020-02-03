const express = require('express');
const router  = express.Router();
const { loginPage, loginUser, signUpPage, signUpUser, logout, privatePage, mainPage } = require("../controller/authColtroller")


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', loginPage)

router.post('/login', loginUser)

router.get('/signup', signUpPage)

router.post('/signup', signUpUser)

router.get('/private', privatePage)

router.get('/main', mainPage)

router.get('/logout', logout)

module.exports = router;
