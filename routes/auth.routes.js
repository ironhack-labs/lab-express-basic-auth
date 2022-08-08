const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// ***********************
// SIGNUP
// ***********************
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPW) => {
      console.log("Hashed password: ", hashedPW);
      return User.create({ username, password: hashedPW });
    })
    .then((newUser) => {
      const { username } = newUser;
      console.log(`Welcome our newest user: ${username}!!!`);
      res.redirect("/auth/login");
    })
    .catch((err) => console.log("No new user got created, sorry.", err));
});

// ***********************
// LOG IN
// ***********************
router.get("/login", (req, res) => res.render("auth/login"));

module.exports = router;
