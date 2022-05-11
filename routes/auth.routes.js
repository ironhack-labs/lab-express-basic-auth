const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const mongoose = require("mongoose");
const User = require("../models/User.model");

const router = require("express").Router();

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//// SignUp ////

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((user) => {
      res.redirect("/userProfile");
    })
    .catch((err) => next(err));
});

router.get("/userProfile", (req, res) => res.render("profile"));


router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  console.log("SESSION =====> ", req.session);

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Enter a username & a password to login",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "No such username" });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        req.app.locals.currentUser = user;

        res.render("profile", { user });
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password" });
      }
    })
    .catch((err) => next(err));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private");
});

router.get("/main", isLoggedOut, (req, res) => {
    res.render("main");
  });
  

module.exports = router;
