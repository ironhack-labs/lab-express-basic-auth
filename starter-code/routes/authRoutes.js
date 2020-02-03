const express = require('express');
const router  = express.Router();
const {
  indexView,
  loginView,
  loginPost,
  signupView,
  signupPost,
  privateView,
  mainView,
  logout
}  = require('../controller/authControllers')

const { isLoggedIn } = require('../middleware/isLogged')

/* GET home page */
router.get('/',indexView)
router.get('/auth/signup',signupView) 
router.POST('/auth/signup',signupPost)
router.get('/aunth/login',loginView)
router.POST('/aunth/login',loginPost)
router.get('/private', isLoggedIn, privateView)
router.get('/main', isLoggedIn, mainView)
router.get('/main', logout)

module.exports = router