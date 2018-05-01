const express = require('express');
const router  = express.Router();
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/signup", (req, res, next) => {
    res.render("signup");
  });
  
  router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      //could also do this
      //const data = {};
      //data.errorMessage =  "Indicate a username and a password to sign up";
  
      res.render("signup", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "username": username },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists"
        });
        return;
      }
  
      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      const newUser = User({
        username,
        password: hashPass
      });
  
      newUser.save((err) => {
        res.redirect("/");
      });
    });
  });
  


module.exports = router;