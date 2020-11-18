const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render("auth/signup", { message: "Password must be 8 chars min" });
  }
  if (username === "") {
    res.render("auth/signup", { message: "Username cannot be empty" });
  }

  //checking if username already exists:
  User.findOne({ username: username }).then((usernameFound) => {
    if (usernameFound !== null) {
      res.render("auth/signup", { message: "Wrong credentials" });
    } else {
      //create user and hash the password:
      const salt = bcrypt.genSaltSync();
      console.log(salt);
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash })
        .then((userFromDB) => {
          req.session.user = userFromDB;
          res.redirect("/");
        })
        .catch((err) => {
          console.log("error in signup", err);
        });
    }
  });
});

module.exports = router;
