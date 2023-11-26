const express = require("express");
const authRouter = express();

const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 12;

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middlewares/isLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedOut");

authRouter.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

authRouter.post("/signup", isLoggedOut, async (req, res) => {
  //STEP 1: DECONSTRUCT BODY
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("auth/signup", {
      error: "Please enter a username and password.",
    });
    return;
  }
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    res.render("auth/signup", {
      error: "User already exists!",
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPW) => {
      return User.create({
        username,
        passwordHash: hashedPW,
      });
    })
    .then(() => {
      res.redirect("/login");
    });
});

authRouter.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

authRouter.post("/login", isLoggedOut, (req, res) => {
  const { username, password } = req.body;
  //first see if both username and PW were entered
  if (!username || !password) {
    res.render("auth/login", { error: "Please enter a username and password" });
    return;
  }
  //next find if user exists in DB
  User.findOne({ username }).then((foundUser) => {
    if (!foundUser) {
      res.render("auth/login", {
        error: "User does not exist. Please sign up instead.",
      });
      return;
    }

    //check if PW match:

    bcrypt.compare(password, foundUser.passwordHash).then((isSamePW) => {
      if (!isSamePW) {
        res.render("auth/login", { error: "Wrong password." });
        return;
      }
      req.session.currentUser = foundUser;
      console.log("SESSION SHOULD BE CREATED");
      console.log(foundUser);
      res.render("main", { name: foundUser.username });
    });
  });
});

authRouter.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = authRouter;
