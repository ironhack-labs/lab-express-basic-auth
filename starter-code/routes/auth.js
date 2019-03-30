const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// middleware function to validate credentials
const emptyCredentials = (req, res, next) => {
  let { username, password } = req.body;
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

const authenticate = (req, res, next) => {
  let { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      // user doesn't exists
      if (!user)
        res.render("auth/login-signup", {
          err: "User doesn't exists, check your username",
          login: req.url.includes("login")
        });
      if (bcrypt.compareSync(password, user.password)) {
        // store cookie
        req.session.currentUser = user;
        next();
      } else {
        res.render("auth/login-signup", {
          err: "Incorrect password",
          login: req.url.includes("login")
        });
      }
    })
    .catch(err => {
      console.log(`Error durante login`);
      console.log(err);
      res.render("auth/login-signup", {
        err: `An error has occurred during login, please try later`,
        login: false
      });
    });
};

router.get("/login", (req, res) => {
  // Aqui no se considera el slash en la ruta
  res.render("auth/login-signup", { login: true });
});

router.get("/signup", (req, res) => {
  // Aqui no se considera el slash en la ruta
  res.render("auth/login-signup", { login: false });
});

router.post("/login", emptyCredentials, authenticate, (req, res, next) => {
  res.render("private");
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
