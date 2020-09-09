const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcrypt = require("bcrypt");

// VIEWS RENDERING

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// USER SIGNUP

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("signup", {
      message: "Fields cannot be empty",
    });
    return;
  }

  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render("signup", { message: "Username already exists" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({
        username: username,
        password: hash,
      }).then((dbUser) => {
        res.redirect("/login");
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("login", {
      message: "Fields cannot be empty",
    });
    return;
  }

  User.findOne({ username: username })
    .then((found) => {
      if (found === null) {
        res.render("login", {
          message: "Check you username and password",
        });
        return;
      }
      if (bcrypt.compareSync(password, found.password)) {
        req.session.user = found;
        res.redirect("/private");
      } else {
        res.render("login", {
          message: "Check you username and password",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// USER LOGOUT

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
