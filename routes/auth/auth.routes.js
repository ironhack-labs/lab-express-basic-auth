const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res) => {
  res.render('auth/signup-form');
});

router.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !email || !password) {
    res.render('auth/signup-form', {
      errorMessage:
        'All fields are mandatory. Please provide your username, email and password.',
    });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render('auth/signup-form', {
      errorMessage:
        'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
        email,
      });
    })
    .then((userFromDb) => {
      console.log('created a new User:', userFromDb);
      req.session.currentUser = userFromDb;
      res.redirect('/auth/user-space');
    })
    .catch((err) => console.log('something didnt work: ', err));
});

router.get('/login', (req, res) => {
  res.render('auth/login-form');
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const plainPassword = req.body.password;
  const email = req.body.email;

  if (email === '' || plainPassword === '' || username === '') {
    res.render('auth/login-form', {
      errorMessage: 'Email, password and username are required to login.',
    });
    return;
  }

  User.findOne({ username: username }).then((userFromDb) => {
    const hash = userFromDb.passwordHash;
    const verifyPassword = bcryptjs.compareSync(plainPassword, hash);

    if (verifyPassword) {
      req.session.currentUser = userFromDb;
      res.redirect('/auth/user-space');
    } else {
      res.render('auth/login-form', {
        errorMessage: 'Password incorrect, please try again!',
      });
    }
  });
});

router.get('/auth/user-space', (req, res) => {
  if (req.session.currentUser) {
    const session = req.session;
    res.render('auth/logged-in', { userInSession: session });
  } else
    res.render('auth/login-form', { errorMessage: 'You are not logged in!' });
});

module.exports = router;
