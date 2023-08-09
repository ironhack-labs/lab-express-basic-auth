const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");

// Require auth middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// saltRounds gives us the time that the password is going going to be hashed
const saltRounds = 10;

/* Signup */

// Get route that displays a form for new users to signup
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

// Post route to submit the data of the form
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup", {
        errorMessage: "All fields are mandatory to filled to signup",
      });
      return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!regex.test(password)) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Password needs at least 6 characters and must have, at least, 1 uppercase letter",
      });
    }

    // generate the salt (extra data to password), in 10 saltRounds

    let salt = await bcryptjs.genSalt(saltRounds);
    let hashedPassword = await bcryptjs.hash(password, salt);

    /* let newUser =  */ await User.create({
      username,
      password: hashedPassword,
    });

    res.redirect("/login");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage: "User not found and/or incorrect password",
      });
    } else {
      next(error);
    }
  }
});

/* Login */

//GET Route to display a login Form
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

//Post Route to submit the info of the Login Form
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (username === "" || password === "") {
      res.status(400).render("auth/login", {
        errorMessage: " Please enter both, email and password",
      });
      return;
    }
    // find a user that has the same email that was prompted
    let foundUser = await User.findOne({ username });
    if (!foundUser) {
      res.status(500).render("auth/login", { errorMessage: "User not found" });
    } else if (bcryptjs.compareSync(password, foundUser.password)) {
      req.session.currentUser = foundUser;
      res.redirect("/profile");
    } else {
      res
        .status(500)
        .render("auth/login", { errorMessage: "Incorrect password" });
    }
  } catch (error) {}
});

/* LOGOUT */
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

/* User profile */
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("user-profile", { userInSession: req.session.currentUser });
});

module.exports = router;
