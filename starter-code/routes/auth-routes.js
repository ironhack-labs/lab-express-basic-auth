const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');
const authRoutes = express.Router();
authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup-view.ejs');
});

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === '' || password === '') {
    res.render('auth/signup-view.ejs', {
      errorMessage: 'Please fill out both'
    });
    return;
  }
  User.findOne(
    { username: username },
    { username: 1},
    (err, foundUser)=> {
    if(err) {
      next(err);
      return;
    }
    if (foundUser !== null) {
      res.render('auth/signup-view.ejs', {
        errorMessage: 'The username already exists'
      });
      return;
    }
    const salt = bcrypt.genSaltSync(5);
    const hashPass = bcrypt.hashSync(password, salt);
    const userInfo = {
      username: username,
      password: hashPass
    };
    const theUser = new User(userInfo);
    theUser.save((err) => {
      if(err) {
        res.render('auth/signup-view.ejs', {
          errorMessage: 'Error Saving'
        });
        return;
      }
      res.redirect('/login');
    });
  });
});
authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login-view.ejs');
});
authRoutes.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === '' || password === '') {
    res.render('auth/login-view.ejs', {
      errorMessage: 'Indicate a username and password to login'
    });
    return;
  }
  User.findOne({ username: username }, (err, user) => {
    if(err) {
      next(err);
      return;
    }
    if(!user) {
      res.render('auth/login-view.ejs', {
        errorMessage: 'The username does\'t exist'
      });
      return;
    }
//compares submitted password with encrypted password to check if they're the same.
    if(bcrypt.compareSync(password, user.password)) {
      //store user info in session.currentUser
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('auth/login-view.ejs', {
        errorMessage: 'The password is incorrect'
      });
    }
  });
});
authRoutes.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    //cannot access session here
    res.redirect('/login');
  });
});
module.exports = authRoutes;
