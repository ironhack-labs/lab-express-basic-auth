const express = require("express");
const router = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("./signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("./signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ username: username }).then(user => {
    if (user !== null) {
      res.render("./signup", {
        errorMessage: "User Name already exists"
      });
      return;
    }
  });
  let newUser = new User({ username, password });
  newUser
    .save()
    .then(() => {
      res.render("./index", {
        successMessage: "User created"
      });
    })
    .catch(e => {
      console.log(e);
    });
});

module.exports = router;
