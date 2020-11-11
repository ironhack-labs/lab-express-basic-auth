const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

router.get("/", (req, res, next) => res.render("index"));

router.get("/signup", (req, res) => res.render("signup"));

const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/");
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res) => res.render("users/user-profile"));

module.exports = router;
