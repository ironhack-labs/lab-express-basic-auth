const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const emptyCredentials = require("../helpers/emptyCredentials");
const authenticate = require("../helpers/authenticate");

// console.log("function???",emptyCredentials);
// console.log("function???",authenticate);

router.get("/login", (req, res) => {
  // Aqui no se considera el slash en la ruta
  res.render("auth/login-signup", { login: true });
});

router.get("/signup", (req, res) => {
  // Aqui no se considera el slash en la ruta
  res.render("auth/login-signup", { login: false });
});

router.post("/login", emptyCredentials, authenticate, (req, res, next) => {
  res.redirect("/main");
});

router.post("/signup", emptyCredentials, (req, res, next) => {
  let { username, password } = req.body;
  const salt = 10;
  const bsalt = bcrypt.genSaltSync(salt);
  password = bcrypt.hashSync(password, bsalt);
  User.create({ username, password })
    .then(() => {
      res.redirect("/auth/login");
    })
    .catch(err => {
      let { code } = err;
      console.log(`Error en proceso de signup`);
      console.log(err);
      // duplicated key
      if (code === 11000)
        res.render("auth/login-signup", {
          err: `Username ${username} already exists, try another one`,
          login: false
        });
      else
        res.render("auth/login-signup", {
          err: `An error has occurred, please try later`,
          login: false
        });
    });
});

module.exports = router;
