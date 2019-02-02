const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const saltRounds = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET signup page
router.get('/signup', (req, res, next) => {
  res.render('sign-up');
});

// POST signup form submission
router.post('/signup', (req, res, next) => {
  const { username } = req.body;
  const { password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);
  const newUser = User({
    username,
    password: hashPass
  });

  if (username === '' || password === '') {
    res.render('sign-up', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render('sign-up', { errorMessage: 'The username already exists!' });
      return;
    }
    newUser.save()
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => {
        next(error);
      });
  });
});

// GET signin page
router.get('/signin', (req, res, next) => {
  res.render('sign-in');
});

router.post('/signin', (req, res, next) => {
  const { username } = req.body;
  const { password } = req.body;

  if (username === '' || password === '') {
    res.render('sign-in', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({ 'username': username })
    .then((user) => {
      if (!user) {
        res.render('sign-in', {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.render('private');
      } else {
        res.render('sign-in', {
          errorMessage: 'Incorrect password'
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// Protected Routes
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/signin');
  }
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

// Logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


module.exports = router;
