const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login", {
        message: "Your sesssion has expired, please login",
      });
    }
  };
};

router.get("/signup", (req, res, next) => {
  res.render("authentification/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render("authentification/signup", {
      message: "Username||Password combination invalid",
    });
  }
  if (username === "") {
    res.render("authentification/signup", {
      message: "Please define a Username",
    });
  }
  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render("authentification/signup", {
        message: "Username already taken!",
      });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash })
        .then((dbUser) => {
          req.session.user = dbUser;
          res.redirect("privat/dashboard");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("authentification/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).then((found) => {
    if (found === null) {
      res.render("authentification/login", {
        message: "Username||Password combination invalid",
      });
    }
    if (bcrypt.compareSync(password, found.password)) {
      req.session.user = found;
      res.redirect("privat/dashboard");
    } else {
      res.render("login", {
        message: "Username||Password combination invalid",
      });
    }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.render("authentification/logout");
    }
  });
});

router.get("/privat/dashboard", loginCheck(), (req, res, next) => {
  console.log("session log", req.session);
  const loggedinUser = req.session.user;
  res.render("privat/dashboard", { loggedinUser });
});

module.exports = router;
