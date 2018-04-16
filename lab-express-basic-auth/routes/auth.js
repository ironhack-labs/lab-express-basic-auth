const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const bcryptSalt = 10;

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// POST signup
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;  

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne( {"username":username},
    "username",
    (err, user) => {
      if( user !== null ) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User( {
        username, 
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    }
  )
});

module.exports = router;
