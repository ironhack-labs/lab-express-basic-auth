const express = require("express");
const authRoutes = express.Router();

const User = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


authRoutes.get("/", (req, res, next) => {
  res.render("home");
});


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);


  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }


  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "Username already exist"
      });
      return;
    }

    const newUser  = User({
      name: username,
      password: hashPass
    });

    newUser.save(err => {
      res.redirect("/");
    });
});


});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});


authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
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




module.exports = authRoutes;
