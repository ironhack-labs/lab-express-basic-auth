const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const saltRounds = 10;

router.get("/signup", isLoggedOut, async (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch (error) {
    next(error);
  }
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
  try {
    //console.log(req.body);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.render("auth/signup", {
        errorMessage: "All fields are required!",
      });
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
    if (!passwordRegex.test(password)) {
      return res.status(500).render("auth/signup", {
        errorMessage:
          "Password needs to be at least 6 characters, and must contain one uppercase letter, one lowercase letter, a number, and a special character.",
      });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    await User.create({ username, email, passwordHash });
    res.redirect("/profile");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage: "Username or email already in use",
      });
    } else {
      next(error);
    }
  }
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const { currentUser } = req.session;
    res.render("auth/profile", currentUser);
  } catch (error) {
    next(error);
  }
});

router.get("/login", isLoggedOut, async (req, res, next) => {
  try {
    res.render("auth/login");
  } catch (error) {
    next(error);
  }
});

router.post("/login", isLoggedOut, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //console.log("--> Session", req.session);
    if (email === "" || password === "") {
      return res.render("auth/login", {
        errorMessage: "Please enter both email and password.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", {
        errorMessage: "Email is not registered. Please try another email.",
      });
      // checking if the password matches
    } else if (bcrypt.compareSync(password, user.passwordHash)) {
      // rendering the user to the profile view
      req.session.currentUser = user;
      res.redirect("/profile");
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password." });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    }
    res.redirect("/");
  });
});

module.exports = router;
