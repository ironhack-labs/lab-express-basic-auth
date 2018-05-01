const express = require('express');
const router  = express.Router();
const User = require("../models/user");


const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
    res.render("login");
  });
  
  
  router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("login", {
        errorMessage: "Indicate a username and a password to log in"
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
          console.log(req.session.currentUser);
          req.session.currentUser = user;
          res.redirect("/main");
        } else {
          res.render("login", {
            errorMessage: "Incorrect password"
          });
        }
    });
  });


  module.exports = router;