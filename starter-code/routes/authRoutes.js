const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

 if (username === "" || password === "") {
   res.render("auth/login", {
     errorMessage: "Indicate a username and a password to sign up"
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
       res.redirect("/private");
     } else {
       res.render("auth/login", {
         errorMessage: "Incorrect password"
       });
     }
 });

});

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ "username": username },"username",(err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser  = new User({
      username: username,
      password: hashPass
    });


    if (username === "" || password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: err
        });
      } else {
        res.redirect("/private");
      }
    });

  });

});


module.exports = authRoutes;
