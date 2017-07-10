/* jshint esversion: 6 */

const express = require("express");
const authRoutes = express.Router();

const bcrypt = require("bcrypt");

const User = require("../models/user");
const bcryptSalt = 10;

authRoutes.get("/login",(req,res,next) =>{
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
        res.redirect("/secret");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

authRoutes.get("/signup",(req,res,next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup",(req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === ""){
    res.render("auth/signup", {
      errorMessage: "Indicate username and password"
    });
    return;
  }

  User.findOne({"username": username}, "username", (err,user) =>{
    if(user !== null){
      res.render("auth/signup", {
        errorMessage: "Username already exists"
      });
      return;
    }
  });

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hashPass
  });

  newUser.save((err) =>{
    if(err){ return next(err);}
    res.redirect("/");
  });

});

module.exports = authRoutes;
