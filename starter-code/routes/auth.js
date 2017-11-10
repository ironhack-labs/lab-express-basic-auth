const express = require('express');
const router = express.Router();

// User model
const User           = require("../models/user").User;

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// -- LOGIN --

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.post('/login', function(req, res, next) {
  res.send('respond with resource');
});


// -- SIGNUP --

router.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username } , "username", (err, user) => {
    if (user !== null) {
      return res.render("auth/signup", {
        errorMessage: "The user already exists"
      });
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    if (username === "" || password === "") {
      return res.render("auth/signup", {
        errorMessage: "Insert Username and Password"
      });

    }

    var newUser = User({
        username,
        password: hashPass
      });
      console.log(newUser);
    
      newUser.save((err) => {
        res.redirect("/");
      });



  });

});



module.exports = router;