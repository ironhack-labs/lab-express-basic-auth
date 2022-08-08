const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const isLoggedOut = require("../middleware/isLoggedOut.middleware");
const isLoggedIn = require("../middleware/isLoggedIn.middleware");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// ***********************
// SIGNUP
// ***********************
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPW) => {
      console.log("Hashed password: ", hashedPW);
      return User.create({ username, password: hashedPW });
    })
    .then((newUser) => {
      const { username } = newUser;
      console.log(`Welcome our newest user: ${username}!!!`);
      res.redirect("/auth/login");
    })
    .catch((err) => console.log("No new user got created, sorry.", err));
});

// ***********************
// LOG IN
// ***********************
router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

router.post("/login", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    res.status(400).render("auth/login", {
      usernameError: "No username provided",
    });
    return;
  }

  if (!password) {
    return res.status(400).render("auth/login", {
      passwordError: "No password provided",
    });
  }

  User.findOne({ username })
    .then((possibleUser) => {
      if (!possibleUser) {
        return res.status(400).render("auth/login", {
          generalError: "Wrong credentials",
        });
      }

      // Here we know that there is a user
      const isSamePassword = bcrypt.compareSync(
        password,
        possibleUser.password
      );

      if (!isSamePassword) {
        return res.status(400).render("auth/login", {
          generalError: "Wrong credentials",
        });
      }

      // the user exists. the password is the same. you must be the right person
      req.session.userId = possibleUser._id;
      console.log("Session info: ", req.session.userId);
      res.redirect(`/user/${possibleUser._id}`);
    })
    .catch((err) => {
      console.log("Something failed whilst reaching for a user", err);
      res.status(500).render("auth/login", { generalError: "oopsie daisy" });
    });
});

// ***********************
// LOGOUT
// ***********************
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("Clearing Cookies, 'cause we love them gone");
    if (err) {
      return res.status(500).redirect("/");
    }
    res.redirect("/");
  });
});

module.exports = router;
