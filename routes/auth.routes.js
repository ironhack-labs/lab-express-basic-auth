const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;
const User = require("../models/User.model");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "")
    res.status(400).render("auth/signup", {
      errorMessage: "Email and Password are mandatory fields.",
    });
    else{
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((passwordHash) => {
      return User.create({ email, passwordHash});
    });}
});

module.exports = router;
