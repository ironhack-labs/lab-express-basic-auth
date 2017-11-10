const express = require("express");
const authRoutes = express.Router();
const userModel = require("../models/User");

const bcrypt = require("bcrypt");
const bcryptSalt = 150; // Because YOU stole my axe!!!

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
})

authRoutes.post("/signup", (req, res, next) => {
  const userData = {
    username: req.body.username,
    password: req.body.password
  }

  const newUser = new userModel(userData);

  if (userData.username === "" || userData.password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  newUser.findOne({ "username": username }, "username", (err, user) => {
  if (user !== null) {
    res.render("auth/signup", {
      errorMessage: "The username already exists"
    });
    return;
  }

  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  newUser.save()
    .then(() => {
      res.redirect("/");
    }).catch((error) => {
      res.render("error", { errorMessage: "Something went wrong when signing up"});
    });
  });


});

module.exports = authRoutes;
