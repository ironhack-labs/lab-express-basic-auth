const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../db/User.model');
const saltRounds = 10;

router.get('/login', (req, res) => {
  res.render('login');
});
router.get('/main', (req, res) => {
  res.render('main');
});
router.get('/private', (req, res) => {
  res.render('private');
});
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('ogin', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('login', { errorMessage: 'Username is not registered. Try with other username.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        res.redirect('/');
      } else {
        res.render('login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});
router.post('/signup', (req, res, next) => {
   
  const { username, password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/login');
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