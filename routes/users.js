const express = require("express");
const router = require("express").Router();
const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

//GET sign up page
router.get("/signup", (req, res) => {
  res.render("signup");
});

//POST Sign up page

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((passwordHash) => {
      console.log({ passwordHash });
      return User.create({
        username,
        passwordHash,
      });
    })
    .then((userCreated) => {
      console.log("new user created", userCreated);
      res.redirect("/");
    })
    .catch((error) => error);
});

module.exports = router;
