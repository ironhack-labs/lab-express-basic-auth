const express = require("express");
const router = require("express").Router();
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

//GET sign up page
router.get("/signup", (req, res) => {
  res.render("signup");
});

//POST Sign route
router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("users/signup", {
      errorMessage: " password and Email cannot be empty",
    });
    return;
  }

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
      const { username, _id } = userCreated;

      req.session.currentUser = { username, _id };
      req.app.locals.currentUser = req.session.currentUser;
      console.log("new user created", userCreated);
      res.redirect("/");
    })
    .catch((error) => error);
});

//GET login

router.get("/login", (req, res) => {
  res.render("login");
});
//post route for login
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login", {
          errorMessage: "User is not registered. Try with other user.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.render("user-profile", { user });
      } else {
        res.render("login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

//user profile route
router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("user-profile", { userInSession: req.session.currentUser });
});

//POST ROUTE FOR LOGGOUT
router.post("/users/logout", (req, res, next) => {
  req.session.destroy((err) => {
    req.app.locals.currentUser = null;
    if (err) next(err);
    res.redirect("/");
  });
});

//GET ROUTE FOR MAIN PAGE
router.get("/main", isLoggedIn, (req, res) => res.render("/main"));

// /GET ROUTE FOR PRIVATE PAGE
router.get("/private", isLoggedIn, (req, res) => res.render("/private"));

module.exports = router;
