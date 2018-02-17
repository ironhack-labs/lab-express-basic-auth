const express = require('express');
const authRouter = express.Router();

const User = require('../models/user')

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authRouter.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})

authRouter.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === '' || password === '') {
    console.log('if statement 1')
    res.render('auth/signup', {errorMessage: 'missing username or password'})
    return;
  }
  User.findOne({username: username}, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user !== null) {
      console.log(user)
      res.render('auth/signup', {errorMessage: 'username is taken'})
      console.log('if statement 2')
      return;
    } else {
      console.log('else statement')
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      var newUser = User({
        username,
        password: hashPass
      });
      newUser.save((err) => {
        res.redirect('/');
      });
    }
  });
});

authRouter.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRouter.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username ==='' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    console.log('Empty password || username')
    return ;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render('auth/login', {
        errorMessage: 'The username doesn\'t exist'
      });
      return;
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      console.log(req.session.currentUser)
      res.redirect('/');
    } else {
      res.render('auth/login', {
        errorMessage: 'Incorrect password'
      });
    }
  });
});


module.exports = authRouter;