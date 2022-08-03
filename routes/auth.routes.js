const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require("mongoose");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup")
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({ username, password: hashedPassword });
    })
    .then(() => res.redirect("/"))
    .catch(error => next(error));
});


module.exports = router;