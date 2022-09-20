const express = require("express");
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const router = express.Router();

// Creating routes
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Creating post routes
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;

  if (!username) {
    res.render("auth/signup", {
      errorMessage: "Please provide a valid username",
    });
    return;
  }

  if (!password) {
    res.render("auth/signup", {
      errorMessage: "Please privide a password",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((passwordHash) => {
      return User.create({
        username: username,
        password: passwordHash,
      });
    })
    .then((userBD) => {
      res.render("auth/user-profile", userBD);
    })
    .catch((err) => console.log(err));
});

// Creating Login routes
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMesage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username }).then((user) => {
    if (!user) {
      res.render("auth/login", {
        errorMessage: "Username is not registered. Try with other username.",
      });
      return;
    } else if (bcryptjs.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.render("auth/user-profile", user);
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect Password",
      });
    }
  });
});
module.exports = router;
