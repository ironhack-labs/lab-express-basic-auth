const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {mostrarSignup, hacerSignup, mostrarLogin, hacerLogin, access, accessMain, accessPrivate} = require('../controllers/index')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* USER THING */
/* Sign up */
router.get('/signup', mostrarSignup)
router.post('/signup', hacerSignup)

/* Log in */
router.get('/login', mostrarLogin)
router.post('/login', hacerLogin)

/* Access/Profile, Main & Private */
router.get('/profile', access)
router.get('/main', accessMain)
router.get('/private', accessPrivate)

/* Función checadora */
function isLoggedIn(req, res, next) {
  if (req.session.loggedUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
