var express = require('express');
var router = express.Router();

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/* GET home page. */


router.get('/authenticate', function(req, res, next) {
  res.render('authenticate', { title: 'AuthenticateMe' });
});


router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username === "" || password === "") {
    res.render("authenticate", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  
  User.findOne({ username: username }, 'username', (err, user) =>{

    if (user !== null) {
      res.render("authenticate", {
        errorMessage: "The username already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
    })

    newUser.save((err) => {
      if (err) { return next(err) }
      res.redirect('/');
    })
  })
});

module.exports = router;
