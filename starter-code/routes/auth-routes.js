const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 2;

router.get("/signup", (req, res) => {
  console.log("signup");
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;

  if (username == "" || password == ""){
    console.log("EMPTY")
    res.render("auth/signup",{
      errorMessage: "Username or password can't be empty"
    });
    return;
  }

  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  let newUser = User({
    username,
    password: hashPass
  });

  newUser.save(err => {
    res.redirect("/signupt");
  });
});

module.exports = router;
