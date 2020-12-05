const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Router } = require('express');
const router = new Router();
const saltRounds = 10;
const User = require('../models/User.model');


router.get('/signup', (req, res) => res.render('auth/signup'));
 
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', user);
      res.render("users/profile", { user });
    })
    .catch(error => next(error));
});

// ITERATION 2 - Login
// Router GET
router.get('/login', (req, res) => res.render('auth/login'));

// Router POST - Verify that input is in DB and guarantee acess
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

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
          res.redirect('/profile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
});

// Route to user profile
router.get('/profile', (req, res) => {
    res.render('users/profile', { user: req.session.currentUser });
  });

  router.get('/main', (req, res) => {
    res.render('users/main', { user: req.session.currentUser });
  });

  router.get('/private', (req, res) => {
    res.render('users/private', { user: req.session.currentUser });
  });

 
module.exports = router;
 

