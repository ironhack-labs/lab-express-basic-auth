const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;

  if (user === '' || password === '') {
    res.render('signup', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }
  User.findOne({ user: user })
    .then(username => {
      if (username !== null) {
        res.render('signup', {
          errorMessage: 'The username already exists!'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
        user: user,
        password: hashPass
      })
        .then(() => {
          res.redirect('/');
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

/* ----------Login-------- */
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const theUsername = req.body.user;
  const thePassword = req.body.password;

  if (theUsername === '' || thePassword === '') {
    res.render('login', {
      errorMessage: 'Please enter both, username and password to sign up.'
    });
    return;
  }

  User.findOne({ user: theUsername })
    .then((username) => {
      if (!username) {
        res.render('login', {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, username.password)) {
        // Save the login in the session!
        req.session.currentUser = username;
        res.redirect('/');
        // console.log('login: ', username);
      } else {
        res.render('login', {
          errorMessage: 'Incorrect password'
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
