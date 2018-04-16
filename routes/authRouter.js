const express = require("express");
const authRoutes = express.Router();
const router = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

   if (username === "" || password === "") {
     res.render("auth/signup", { 
       errorMessage: "Invalid username and/or password" });
     return;
   }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { 
        errorMessage: "This name is already in use" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Try Again" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/login", (req, res) => {
  res.render("auth/login");
});

authRoutes.get("/main", (req, res) => {
  res.render("auth/main");
});

authRoutes.get("/private", (req, res) => {
  res.render("auth/private");
});

authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please use your name and password"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "Can't find user, try again"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/auth/main");
    } else {
      res.render("auth/login", {
        errorMessage: "Wrong password"
      });
    }
  });
});

module.exports = authRoutes;
