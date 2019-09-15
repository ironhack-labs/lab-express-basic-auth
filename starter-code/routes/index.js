const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {showSignup, makeSignup, showLogin, makeLogin, access, accessMain, accessPrivate} = require('../controllers/index')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/*Signup Router, '/signup refers to the action in views' and showSignup refers to the controller in index.js*/

 router.get('/signup', showSignup)
 router.post('/signup', makeSignup)

 /* Log in */
 router.get('/login', showLogin)
 router.post('/login', makeLogin)
 
 /* Access/Profile, Main & Private */
 router.get('/profile', access)
 router.get('/main', accessMain)
 router.get('/private', accessPrivate)
 
 /* Function Checker */
 function isLoggedIn(req, res, next) {
   if (req.session.loggedUser) {
     next();
   } else {
     res.redirect('/login');
   }
 }

module.exports = router;
