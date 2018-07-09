const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { title: "Signup" });
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  var fieldsPromise = new Promise((resolve, reject) => {
    if (username === "" || password === "") {
      reject(new Error("Indicate a username and a password to sign up"));
    } else {
      resolve();
    }
  });

  fieldsPromise
    .then(() => {
      return User.findOne({ username });
    })
    .then(user => {
      if (user) {
        throw new Error("The username already exists");
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      return newUser.save();
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", {
        errorMessage: err.message
      });
    });
});

module.exports = router;
