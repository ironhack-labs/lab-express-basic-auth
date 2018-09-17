const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

/* login*/

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const encriptedPassword = req.body.password;


  if (username === "" || encriptedPassword === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(encriptedPassword, user.encriptedPassword)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("private");
      } 
      else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});


module.exports = router;