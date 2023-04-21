const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// GET signup page
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST signup
router.post("/signup", function (req, res, next) {
  const passwordHash = bcrypt.hashSync(req.body.password, salt);

  new User({
    username: req.body.username,
    email: req.body.email,
    password: passwordHash,
  })
    .save()
    .then(function () {
      res.send("ok new user");
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
