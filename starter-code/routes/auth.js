const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/user');

/* GET sign up page */
router.get('/signup', (req, res, next) => {
  try {
    res.render('auth/signup');
  } catch(e){
    next(e);
  }
});

/* GET login page */
router.get('/login', (req, res, next) => {
  try {
    res.render('auth/login');
  } catch(e){
    next(e);
  }
});

/* GET logout */
router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

/* POST login */
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  //Add fallbacks
  if (!username || !password){
    res.render('auth/login', {
      errorMessage: 'Please enter both username and password to login'
    });
    return;
  }

  User.findOne({ 'username': username })
    .then(user => {
      //Check if user exists
      if(!user){
        res.render('auth/login', {
          errorMessage: "Username doesn't exist. Sign up below!"
        });
      }

      if(bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', {
          errorMessage: 'Invalid username or password!'
        });
      }
    });
});


/* POST user signup */
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // Username and password must be filled
  if (!username || !password){
    res.render('auth/signup', {
      errorMessage: 'Username and password must be filled!'
    });
    return;
  }

  // Check if username already exists
  User.findOne({ 'username': username })
    .then (user => {
      if(user) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists!'
        });
        return;
      }

      User.create({ username, password: hashPass })
        .then(() => {
          res.redirect('/');
        })
        .catch(err => {
          next(err);
        });
    });
});


module.exports = router;