// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

// GET route => to display the signup form
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// POST route => to process form data
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({ username, passwordHash: hashedPassword });
    })
    .then((userFromDB) => {
      res.redirect("/");
    })
    .catch((error) => next(error));
});

module.exports = router;
