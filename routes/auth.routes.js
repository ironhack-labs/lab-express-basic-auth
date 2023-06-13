
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get("/signup", isLoggedOut, (req, res, next) => {
    res.render('auth/signup')
});

router.post("/signup", (req, res, next) => {
    console.log('req.body', req.body)
    const { username, email, password } = req.body;

    User.findOne({username})
    .then(user => {
      if (user) {
        res.render('auth/signup', {errorMessage: 'Incorrect password.' } );
    } else {
// creating the User with hasshed password
    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword
      });
    })
    .then(() => {
      res.redirect(`/auth/login`)})
  }
 })
 .catch(error => next(error));
})

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('auth/profile', { userInSession: req.session.currentUser });
});

router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  console.log(req.body)
  const { username, password } = req.body;

// creating solutions for possible scenarios of correct/incorrect login
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/auth/profile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get('/main', isLoggedIn, (req, res) => {
    res.render('auth/main')
});

router.get('/private', isLoggedIn, (req, res) => {
  res.render('auth/private')
})
module.exports = router;