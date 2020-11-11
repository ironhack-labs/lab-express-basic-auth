const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res, next) => res.render("index"));

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => {
      User.create({ username, email, passwordHash: hashedPassword })
        .then((newUser) => {
          res.redirect("/user");
          console.log(newUser);
        })
        .catch((err) =>
          res.render("signup", {
            errorMessage: "The username or email address is already in use.",
          })
        );
    })
    .catch((err) => console.error(err));
});

module.exports = router;
