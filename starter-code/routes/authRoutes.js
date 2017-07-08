const express = require("express");
const authController = express.Router();
const User = require("../models/User");  // User model
const bcrypt = require("bcrypt"); // Bcrypt to encrypt passwords
const bcryptSalt = 10;

// Show the form
authController.get("/signup", (req, res, next) => {
  res.render("signup");
});

// info from the form
authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log(req.session);
  console.log(req.body);
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        // User has been created...now what?
        res.render("signup", {
          successMessage: "User created!!!!"
        });
      }
    });
  });
});

// Show the LOGIN form
authController.get("/login", (req, res, next) => {
  res.render("login");
});

// info from the form
authController.post("/login", (req, res, next) => {

  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "_id username password following", (err, user) => {
    console.log('USER',user);
    if(err || !user){
       res.render('login',{errorMessage : "The username doesn't exist"
     });
      return;
    }else{
      if(bcrypt.compareSync(password, user.password)){
        console.log('equalsssss');
        req.session.currentUser = user;
        return res.redirect("/");
      }else{
        res.render("login",{
          errorMessage: "Wrong Password"
        });
      }
    }



    });
});


module.exports = authController;
