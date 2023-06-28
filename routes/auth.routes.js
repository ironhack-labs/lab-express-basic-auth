const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const mongoose = require("mongoose");

const express = require("express");
const session = require("express-session");

// get the user model
const User = require("../models/User.model");

// This will render the signup route
router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // username: username
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
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

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  console.log("Session 8===================D", req.session);

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter bot, username an password to login",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        console.log("Username not registered");
        res.render("auth/login", {
          errorMessage: "User not found or incorrect password.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        console.log("Incorrect password. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res) => {
  console.log("Req Session: ", req.session);
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.currentUser) {
    // User is authenticated, proceed to the next middleware/route handler
    return next();
  }
  // User is not authenticated, redirect to main file or send an error response
  res.redirect("/main");
}
// this will get rendered when you have to access
router.get("/main", (req, res) => res.render("private/main"));

router.get("/private", isAuthenticated, (req, res) => {
  // Only authenticated users can access this route
  res.render("private/private");
});

// This will make it possible to send the sign updata to the server
// router.post("signup");
module.exports = router;
