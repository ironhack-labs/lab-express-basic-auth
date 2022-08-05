// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

// <-------------- SIGNUP ------------------>

// GET route => to display the signup form
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// POST route => to process form data
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  debugger;
  // make sure users fill all mandatory fields:
  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({ username, passwordHash: hashedPassword });
    })
    .then((userFromDB) => {
      res.redirect("/user/profile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

// <--------------- LOGIN ------------------>

// GET route => to display the login form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// POST route => to process form data
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }
  User.findOne({ username })
    .then((user) => {
      // If no user with this username, then bring to signup page
      if (!user) {
        console.log("1");

        res.render("auth/signup", {
          errorMessage: "Username is not registered. Please signup.",
        });
        return;
      }
      // If there is user in the DB, compare password and redirect to user profile page
      else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/user/profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => {
      return next(error);
    });
});

router.get("/user/profile", (req, res) => {
  res.render("user/profile", { userInSession: req.session.currentUser });
});

module.exports = router;
