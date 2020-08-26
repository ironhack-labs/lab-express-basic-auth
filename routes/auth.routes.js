const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// .get() route ==> to display the signup form to users

router.get('/signup', (_, res) => res.render('auth/signup'));

router.get('/userProfile', (req, res) => { 
  res.render('users/user-profile', {     
    userInSession: req.session.currentUser 
  });
});

router.get('/login', (_, res) => res.render('auth/login'));

// .post() route ==> to process form data

router.post('/signup', (req, res, next) => {

  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', {
      errorMessage: 'All fields are mandatory. Please provide your username and password'
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render('auth/signup', {
      errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log(`Newly created user is: `, userFromDB);
      res.redirect('/userProfile');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', {
          errorMessage: error.message
        });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    })
})

router.post('/login', (req, res) => {
  console.log('session ====> ', req.session);

  const { username, password } = req.body;

  if (!username && !password) { 
    res.render('auth/login', {
      errorMessage: 'Please enter username & password'
    });
    return;
  }

  if (password && !username) {
    res.render('auth/login', {
      errorMessage: 'Please enter a valid username'
    });
    return;
  }

  if (username && !password) {
    res.render('auth/login', {
      errormessage: 'please enter a valid password'
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'No user found'
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', {
          errorMessage: 'incorrect password'
        });
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/login', {
          errorMessage: error.message
        });
      } else {
        next(error);
      }
    })
})

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
