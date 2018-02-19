const express = require('express');
const authRoutes = express.Router();

// User Model
const User = require('../models/user');

// Bcrypt to Encrypt Passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Route to display Signup form
authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// Route to Handle Signup Form Submission
// Make sure to have the '/' before post route!
// Will not connect to the db without this 
authRoutes.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  // var salt     = bcrypt.genSaltSync(bcryptSalt);
  // var hashPass = bcrypt.hashSync(password, salt);

  // Validation to check whether user has submitted anything
  if(username === '' || password === ''){
    res.render('auth/signup', {
      errorMessage: 'Indicate  username and a password to signup.'
    });
  }

  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render('auth/signup',{
          errorMessage: 'Something went wrong'
        });
      } else{
        res.redirect("/");
      }
    });
  });
});

module.exports = authRoutes;