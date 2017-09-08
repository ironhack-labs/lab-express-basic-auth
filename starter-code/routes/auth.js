const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const bcryptSalt = 12;

router.get('/signup', (req, res) => {
  res.render('auth/signup', {
    title: 'Signup'
  });
});

router.post('/signup', (req, res) => {
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
        name: username,
        password: hashPass
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e));
  });
});

module.exports = router;