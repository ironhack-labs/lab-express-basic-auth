const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
let error = null;

router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
  .then((user) => {
    console.log(`Response is `, JSON.stringify(user));
    if (user) {
      res.render('index', { error: `Username ${user.username} already exists.` });
      return;
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      console.log('Creating user', username);
      User.create({
        username,
        password: hashPass
      })
      .then(() => {
        res.redirect('/login');
      })
      .catch(error => next(error))
    }
  })
  .catch(error => {
    next(error);
  })
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);

  User.findOne({ username })
  .then(user => {
    if (!user) {
      res.render('login', { error: `Username ${username} not found.` });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/main');
    } else {
      res.render('login', { error: 'Incorrect password' });
    }
  })
  .catch(error => {
    next(error);
  })
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
