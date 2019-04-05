const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render("signup/signup")
})

router.post('/signup', (req, res, next) => {

  if (req.body.user == "" || req.body.password == "") {
    res.render("signup/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
      "username": req.body.username
    })
    .then(user => {
      if (user !== null) {
        res.render("signup/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
      
      
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(req.body.password, salt);

      User.create({
          username: req.body.username,
          password: hashPass
        })
        .then(() => {
          res.redirect("/signup");
        })
        .catch(error => {
          console.log(error);
        })
    })
    .catch(error => {
      next(error);
    })

})

module.exports = router;