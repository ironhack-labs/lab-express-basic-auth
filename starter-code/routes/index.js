const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const saltRounds = 10;

const User = require('../models/user');

const router = express.Router();

/* GET home page */
router.use(session({
  secret: 'basic-auth-secret',
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  let errorHandler = 'Username/password cannot be empty.';
  if (username === '' || password === '') {
    res.render('signup', { errorHandler });
  } else {
    User.findOne({ name: username })
      .then((name) => {
        if (!name) {
          const salt = bcrypt.genSaltSync(saltRounds);
          const saltedPassword = bcrypt.hashSync(password, salt);
          User.create({ username, password: saltedPassword });
          res.redirect('/');
        } else {
          errorHandler = 'This username is already taken.';
          res.render('signup', { errorHandler });
        }
      })
      .catch((err) => {
        console.log(err);
        errorHandler = 'An error occured. Please try again.';
        res.render('signup', { errorHandler });
      });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  let errorHandler = 'Username/password is incorrect.';
  User.findOne({ username })
    .then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('login', { errorHandler });
      }
    })
    .catch((err) => {
      console.log(err);
      errorHandler = 'An error occured. Please try again.';
      res.render('login', { errorHandler });
    });
});

router.get('/main', (req, res) => {
  req.session.currentUser ? res.render('main') : res.redirect('login');
});

router.get('/private', (req, res) => {
  req.session.currentUser ? res.render('private') : res.redirect('login');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect('/login');
  });
});


module.exports = router;
