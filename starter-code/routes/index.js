const express = require('express');
const router  = express.Router();
const {loginView, loginPost, signupView, signupPost, profileView, privateView, logout} = require('../controllers/index')
const {isLoggedIn} = require('../middleware/index')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', loginView)
router.post('/login', loginPost)
router.get('/signup', signupView)
router.post('/signup', signupPost)
router.get('/private', isLoggedIn,privateView)
router.get('/profile', profileView)
router.get('/logout', logout)

module.exports = router;
