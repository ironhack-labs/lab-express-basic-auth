
const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');


router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: '!Please provide your username and password.' });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
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
    .then(user => {
      req.session.currentUser = user;
      console.log('created user: ', user);
      res.redirect('/userProfile');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage: 'Username needs to be unique.'
        });
      }
      else {
        next(error);
      }
    })
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {

  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/login', { errorMessage: '!Please provide your username and password.' });
    return;
  }
console.log(req.session);

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'USER  not registered.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        //   console.log(`${username} and password ${user.password}`)
        req.session.currentUser = user;
        console.log(`primeira vez: ${req.session.currentUser}`);
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/userProfile', (req, res) => {
  // console.log('your sess exp: ', req.session.cookie.expires);
  console.log(`seguda vez: ${req.session.currentUser}`);
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

router.get('/main', (req, res) => res.render('users/main', { userInSession: req.session.currentUser }));
router.get('/private', (req, res) => res.render('users/private', { userInSession: req.session.currentUser }));

module.exports = router;
