const express = require("express");
const authRoutes = express.Router();


// User Model
const User = require("../models/user");


// Bcrypt to Encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/home", (req, res, next) => {
  res.render("home");
});


// Route to diaply signup form
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});



// Route to handle signup form submission
authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  
  // CHECK IF USER HAS SUBMITTED ANYTHING
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a Username and Password to Sign Up."
    });
  }

  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save(err => {
      res.redirect("/login");
    });
  });
});



// route to handle login form
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});



// route to handle login form submission
authRoutes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  // check if username exists
  // User.findOne({ username: username }, (err, user) => {
  //   if (err || !user) {
  //     res.render("auth/login", {
  //       errorMessage: "The username doesn't exist"
  //     });
  //     return;
  //   }

  //   // check if password is correct
  //   if (bcrypt.compareSync(password, user.password)) {
  //     // Save the login in the session!
  //     req.session.currentUser = user;
  //     res.redirect("/");
  //   } else {
  //     res.render("auth/login", { errorMessage: "Incorrect password" });
  //   }
  // });
   User.findOne({ username }, "_id username password", (err, user) => {
     if (err || !user) {
       res.render("auth/login", {
         errorMessage: "The username doesn't exist"
       });
     } else {
       if (bcrypt.compareSync(password, user.password)) {
         req.session.currentUser = user;
         res.redirect("/");
       } else {
         res.render("auth/login", { errorMessage: "Incorrect password" });
       }
     }
   });
});

// route to handle logout

authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = authRoutes;
