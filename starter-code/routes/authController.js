const express        = require("express");
const authController = express.Router();
const zxcvbn         = require('zxcvbn');
const auth           = require("../helper/authentication");
// User model
const User           = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


authController.get("/", (req, res, next)=>  {
  res.render("index", {user:req.session.currentUser});
});

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authController.post("/signup", (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;
  if(username === "" || password === ""){
    res.render("auth/signup", {errorMessage: "Empty text field, pelase check again"});
    return;
  }
  User.findOne({username}, "username", (err, usr)=> {
    if (usr !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      username,
      password: hashPass,
    });
    newUser.save((err)=>{
      if (err) {
          res.render("auth/signup", {
            errorMessage: "Something went wrong when signing up"
            //requiredErrorMessage: newUser.errors
          });
        } else {
          res.redirect("/login");
        }
      });

  });

});

authController.get("/login", (req, res, next)=>{
  res.render("auth/login");
});

authController.post("/login", (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;

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
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
        });
    }
    });
});



authController.get("/main", auth.authentication("/login"), (req, res, next)=>{
  res.render("private/main");
});

authController.get("/private", auth.authentication("/login"), (req,res, next) => {
  res.render("private/private");
});


authController.get("/logout", auth.authentication("/login"), (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});
module.exports = authController;
