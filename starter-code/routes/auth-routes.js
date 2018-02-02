const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 14;

authRoutes.get("/", function(req, res, next) {
  res.render("signup", { title: "Signup" });
});

authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username,
    password: hashPass
  });

  console.log(newUser);

  newUser.save(err => {
    res.redirect("/");
  });
});

module.exports = authRoutes;
