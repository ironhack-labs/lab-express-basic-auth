const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

emptyCredentials = (req, res, next) => {
  let { username, password } = req.body;
  console.log(req.url.includes("login"));
  if (!username)
    res.render("auth/login-signup", {
      err: "Username is empty!",
      login: req.url.includes("login")
    });
  if (!password)
    res.render("auth/login-signup", {
      username,
      err: "You must provide a password!",
      login: req.url.includes("login")
    });
  next();
};

router.get("/login", (req, res) => {
  // Aqui no se considera el slash en la ruta
  res.render("auth/login-signup", { login: true });
});

router.get("/signup", (req, res) => {
  // Aqui no se considera el slash en la ruta
  res.render("auth/login-signup", { login: false });
});

router.post("/login", emptyCredentials, (req, res, next) => {
  let { username, password } = req.body;
  User.findOne({ username })
    .then()
    .catch();
});

router.post("/signup", emptyCredentials, (req, res, next) => {
  let { username, password } = req.body;
  User.findOne({ username })
    .then()
    .catch();
});

module.exports = router;
