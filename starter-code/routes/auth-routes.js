const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

const authRoutes = express.Router();

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup.ejs');
});

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup.ejs',{
      errorMessage: 'Username and password cannot be empty.'
    });
    return;
  }
  User.findOne({username: username}, {username: 1}, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }
    if (foundUser !== null) {
      res.render('auth/signup', {
        errorMessage: 'This username already exists!'});
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const userInfo = {
      username: username,
      password: hashPass
    };

    const theUser = new User(userInfo);

    theUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: 'Say something like, like error.'
        });
      }
      res.redirect('/');
    });

  });

});



module.exports = authRoutes;
