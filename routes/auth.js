const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const salt = 10;

const userShouldNotBeAuth = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

//SIGN UP

router.get("/signup", userShouldNotBeAuth, (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  //   console.log("req.body:", req.body);
  if (username.length < 5 || password.length < 8) {
    return res.render("signup", {
      errorMessage: "Please fill out everything in sight",
    });
  }
  User.findOne({ username }).then((userBack) => {
    if (userBack) {
      //   this only happens if youre trying to signup a user, and that username already exists
      res.render("signup", { errorMessage: "Username already taken" });
      return;
    }

    const hashingAlgorithm = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, hashingAlgorithm);
    console.log(username);
    User.create({
      username,
      password: hashedPassword,
    }).then((newUser) => {
      req.session.user = newUser;
      res.redirect("/");
    });
  });
});

//LOG IN

router.get("/login", userShouldNotBeAuth, (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("login");
});

router.post("/login", userShouldNotBeAuth, (req, res) => {
  const { username, password } = req.body;
  if (username.length < 4 || password.length < 8) {
    res.render("login", {
      errorMessage: "Please provide a correct username or password",
    });
  }

  User.findOne({ username }).then((userFromDB) => {
    if (!userFromDB) {
      res.render("login", {
        errorMessage: "please provide a correct username",
      });
      return;
    }
    bcrypt.compare(password, userFromDB.password).then((isSamePassword) => {
      if (!isSamePassword) {
        res.render("login", { errorMessage: "wrong password. try again" });
        return;
      }
      req.session.user = userFromDB;
      res.redirect("/");
    });
  });
});

//SIGN OUT

const checkAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
};

router.get("/logout", checkAuth, function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      // error handleing
    }
    res.redirect("/");
  });
});

module.exports = router;
