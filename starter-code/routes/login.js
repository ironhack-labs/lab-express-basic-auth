
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('login');
})

router.post('/', (req, res,next) => {
  const username = req.body.username;
  const password = req.body.password;

 if (username === "" || password === "") {
   res.render("login", {
     errorMessage: "Indicate a username and a password to sign up"
   });
   return;
 }

 User.findOne({ "username": username }, (err, user) => {
     if (err || !user) {
       res.render("login", {
         errorMessage: "The username doesn't exist"
       });
       return;
     }
     if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  });
})

module.exports = router;
