const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// function errorLog () {
//   if (username === "" || password === "") {
//     res.render("auth/signup", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     return;
//   }
// }

module.exports = router;