const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const bcrypt  = require('bcrypt');
const bcryptSalt = 10;


router.get('/', (req, res, next) => {
  res.render('auth/signup');
})

router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({"username": username})
    .then(user => {
      if(user !== null){
        res.render('auth/signup', {errorMessage: "The username already exists"});
        return
    }
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      password: hashPass
    });
    
    newUser.save()
      .then(user => {
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err)
    });
})

module.exports = router;