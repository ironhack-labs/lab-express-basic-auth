const express = require('express');
const router  = express.Router();
const {
  indexView,
  loginView,
  loginPost,
  signupView,
  signupPost,
  profileView,
  logout
}  = require('../controller/authControllers')

const { isLoggerIn } = require('../middleware/isLogged')

/* GET home page */
router.get('/',indexView)
router.get('/auth/signup',signupView) 
router.POST('/auth/signup',signupPost)
router.get('/aunth/login',loginView)
router.POST('/aunth/login',loginPost)
router.get('/private', isLoggerIn, profileView)
router.get('/main', isLoggerIn, logout)