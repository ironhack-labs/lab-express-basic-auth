const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');

router.get('/signup', (req, res, next) =>{
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render('auth/signup', {
      errorMessage: "Please complete both fields before submitting"
    });
    return;
  }

  User.findOne({username: username}, {username: 1}, (err, selectedUser) => {
    if (err) {
      next(err);
      return;
    }

    if (selectedUser !== null) {
      res.render('auth/signup', {
        errorMessage: "Username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const userInfo = {
      username: username,
      password: hashPass
    };

    newUser = new User(userInfo);

    newUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: 'Oops! There was a problem. Please try again later.'
        });
      }
      res.redirect('/');
    });
  });
});

module.exports = router;
