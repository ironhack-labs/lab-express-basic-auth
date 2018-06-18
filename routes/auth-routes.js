const express = require("express");
const authRoutes = express.Router();

//setup for zxcvbn password complexity
var zxcvbn = require('zxcvbn');


// Captcha 
//### New usage (express-recaptcha version >= 4.*.*)
// var Recaptcha = require('express-recaptcha').Recaptcha;
// //import Recaptcha from 'express-recaptcha'
// var recaptcha = new Recaptcha('SITE_KEY', 'SECRET_KEY');
// //or with options
// // var recaptcha = new Recaptcha('SITE_KEY', 'SECRET_KEY', options);


// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign in"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});



authRoutes.get("/signup", (req, res, next) => {
  res.render( "auth/signup");
});

// Alternative Get with Captcha 
// authRoutes.get("/signup", recaptcha.middleware.render, (req, res, next) => {
//   res.render( "auth/signup", { captcha:res.recaptcha } );
// });



authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  
  
  // Alternative Post for Captcha
  // authRoutes.post("/signup", recaptcha.middleware.verify, (req, res, next) => {
  //   const username = req.body.username;
  //   const password = req.body.password;
    
  //   if (username === "" || password === "") {
  //     res.render("auth/signup", {
  //       errorMessage: "Indicate a username and a password to sign up"
  //     });
  //     return;
  //   }
    
    // complexity checker
    let result = zxcvbn(password)
    if ( result.score < 2 ) {
      res.render("auth/signup", {
        errorMessage: "Your password should be more complicated.  Try picking a longer one."
      });
      return
    }
    
    
    
    // Uncomment for Captcha
    // if (!req.recaptcha.error) {
    //   return
    // }  
    // else {
    //   res.render("auth/signup", {
    //     errorMessage: "You are a robot!"
    //   });
    // }
    
    
    
    User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
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
      
      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(error => {
      next(error)
    })
  });
  
  authRoutes.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/login");
    });
  });
  
  module.exports = authRoutes;