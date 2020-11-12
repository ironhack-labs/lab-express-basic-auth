const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");

const { Router } = require("express");
const router = new Router();

router.get("/auth/signup", (req, res, next) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

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
      console.log("New created user is: ", userFromDB);
      res.redirect("/");
    })
    .catch((error) => next(error));
});

router.get("/auth/login", (req, res, next) => res.render("auth/login"));

module.exports = router;
