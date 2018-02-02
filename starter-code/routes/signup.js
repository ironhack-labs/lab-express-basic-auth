const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/User");

const authRoutes = express.Router();
const Schema = mongoose.Schema;
const bcryptSalt = 12;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  console.log("DEBUG bcrypt", bcrypt);
  let username = req.body.username;
  let password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username,
    password: hashPass
  });

  newUser.save(err => {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = authRoutes;
