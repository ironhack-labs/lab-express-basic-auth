const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


// router.get('/', (req, res, next) => res.render('index.hbs'));

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.get('/login', (req, res, next) => res.render('auth/login'));

router.get('/main', (req, res, next) => res.render('auth/public'));

router.get('/private', isLoggedIn, (req, res, next) => res.render('auth/private'));

router.get('/user', (req, res, next) => {

  User.find()
  .then(userFound => {
    console.log(userFound);
  })
});

router.get('/userProfile', isLoggedIn, (req, res, next) => {
  console.log('**SESSION**', req.session);
  res.render('users/user-profile', { userInSession: req.session.currentUser});
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  console.log(username, password)

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log(hashedPassword)
        return User.create({ username, password: hashedPassword }); // <-- returned so we can use below. 
    })
    .then(userCreated => {
      console.log(`Created new user:`, userCreated);
      res.render('auth/login', {message: 'Username created, please login', user: userCreated })
    })
    .catch(error => {
      console.log('Error creating new user');
      if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage: 'Username already exists, please use another'
        });
      }
    })
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  // console.log(session)

  if (username === '' || password === '') {
    res.render('auth/login.hbs', { errorMessage: 'Please enter both, username and password'});
    return;
  }

  User.findOne({username})
    .then(user => {
      if (!user) {
        res.render('auth/login.hbs', { errorMessage: 'Username not found.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login.hbs', { errorMessage: 'invalid password' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;