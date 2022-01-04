const router = require('express').Router();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

const User = require('../models/User.model');

const isLoggedOut = require('../middleware/isLoggedOut');
const isLoggedIn = require('../middleware/isLoggedIn');
// const res = require('express/lib/response');

router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400)
        .render('auth/signup', { errorMessage: 'Please provide your username'});
    }

    if(password.length < 8) {
        return res.status(400).render('auth/signup', {
            errorMessage: 'Your password must be at least 8 characters long'
        });
    }
    
    
    User.findOne({ username }).then((found) => {
        if (found) {
            return res
            .status(400)
            .render('auth/signup', { errorMessage: 'Username already taken.' });
        }
        
        return bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
            return User.create({
                username,
                password: hashedPassword
            });
        })
        .then((user) => {
            req.session.user = user;
        res.redirect('/');
    })
    .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            return res
            .status(400)
            .render('auth/signup', { errorMessage: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).render('auth/signup', {
                errorMessage: 'Username needs to be unique. This username you chose is already in use.'
            });
        }
        return res
        .status(500)
        .render('auth/signup', { errorMessage: error.message });
    })
})
});

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isLoggedOut, (req, res, next) => {
    const {username, password} = req.body;

    if(!username) {
        return res
        .status(400)
        .render('auth/login', {errorMessage: 'Please provide your username.'});
    }

    if(password.length < 8) {
        return res.status(400).render('auth/login', {
            errorMessage: 'Your password needs to be at least 8 characters long.'
        });
    }

    User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .render('auth/login', { errorMessage: 'Wrong credentials.' });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render('auth/login', { errorMessage: 'Wrong credentials.' });
        }
        req.session.user = user;
        return res.redirect('/');
      });
    })

    .catch((err) => {
      next(err);
    });
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .render('auth/logout', { errorMessage: err.message });
      }
      res.redirect('/');
    });
  });
  
  module.exports = router;