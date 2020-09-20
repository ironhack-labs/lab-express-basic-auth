const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const saltRounds = 10;
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
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
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });
    console.log("Result: " + result);
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        // res.render('users/user-profile', { user });
        req.session.currentUser = user;
        res.redirect("/profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/profile", (req, res) =>
  res.render("users/profile", { userInSession: req.session.currentUser })
);

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
