const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');

 router.get('/profile', isLoggedIn,  (req, res, next) => {
    res.render('profile.hbs', { user:req.session.currentUser});
  });
  
router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/singup.hbs');
  });
  
 router.post('/signup', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/singup.hbs', { errorMessage: 'All fields are required' });
      }
      bcrypt
      .genSalt(saltRounds)
      .then((salt) => {
        return bcrypt.hash(password, salt);
      })
      .then((hashedPassword) => {
        return User.create({
          username,
          passwordHash: hashedPassword,
        });
      })
      .then(() => res.redirect('/profile'))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(500).redirect('/signup', { errorMessage: err.message });
        } else if (err.code === 11000) {
          res.status(500).redirect('/signup', {
            errorMessage:
              'Username needs to be unique.',
          });
        } else {
          next(err);
        }
      });
  });

  router.get('/login',  isLoggedOut, (req, res, next) => res.render('auth/login'));


router.post('/login', isLoggedOut,  (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('auth/login', { errorMessage: 'All fields are required' });
      return;
    }
  
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'User not found' });
          return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user;
            req.app.locals.currentUser = user; 
  
          console.log(req.session);
          res.render('profile', { user });
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password' });
        }
      })
      .catch((err) => next(err));
  }); 
  
  router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      if (err) next(err);
      res.redirect('/');
    });
  });

  router.get('/private', isLoggedIn,  (req, res, next) => {
    res.render('private.hbs', { user:req.session.currentUser});
  });

  router.get('/main', isLoggedIn,  (req, res, next) => {
    res.render('main.hbs', { user:req.session.currentUser});
  });

  module.exports = router;