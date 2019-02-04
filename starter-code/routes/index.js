const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('signup', {
      errorMessage: 'Fields can\'t be blank'
    });
    return;
  }

  User.findOne({ username: username })
    .then((user) => {
      if (user !== null) {
        res.render('signup', {
          errorMessage: 'Username is taken'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashedPass })
        .then(() => {
          res.redirect('/');
        })
        .catch((error) => {
          console.log(error);
        });
    });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('login', {
      errorMessage: 'Fields can\'t be blank'
    });
    return;
  }

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        res.render('login', {
          errorMessage: 'Username doesn\'t exist'
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('login', { errorMessage: 'Incorrect password' });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
