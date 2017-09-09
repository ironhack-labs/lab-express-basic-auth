const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const bcryptSalt = 10;

// SIGNUP: Print form
router.get('/signup', (req, res) => {
  res.render('auth/signup', {
    title: 'Signup'
  });
});

// SIGNUP: Create user in db
router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }).then(user =>{
    if(user){
      res.render("auth/signup", {
        errorMessage: "User already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
        username: username,
        password: hashPass
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e));
  });

});

module.exports = router;
