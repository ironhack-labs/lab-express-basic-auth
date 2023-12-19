const bcrypt = require("bcrypt");
const saltRounds = 10;
const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const {
  isLoggedIn,
  isLoggedOut,
  canYouSeeIt,
} = require("../middlewares/route-guard");
/* GET Signup page */
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});
/* POST Signup  */
router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  //   Checking if existing user
  User.findOne({ username }).then((foundUser) => {
    if (foundUser) {
      // send an error notification
      res.render("auth/signup", { errorMessage: "Username exists" });
    } else {
      bcrypt
        .hash(password, saltRounds)
        .then((hash) => {
          console.log("hash:", hash);
          return User.create({ username, password: hash });
        })
        .then((user) => {
          console.log("user", user);

          req.session.currentUser = user;
          res.render("auth/profile", user);
        })
        .catch((err) => console.log(err));
    }
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  console.log("req.session", req.session);
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ username }) // --> {email: ..., password:....} || null
    .then((user) => {
      console.log("user", user);
      if (!user) {
        console.log("Email not registered. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
        return;
      } else if (bcrypt.compare(password, user.password)) {
        req.session.currentUser = user;
        res.render("auth/profile", user);
      } else {
        console.log("Incorrect password. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((err) => console.log(err));
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});
/* GET Profile page */
router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log("req.session", req.session);
  const { username } = req.session.currentUser.username;
  console.log("the username is:", username);
  res.render("auth/profile", username);
});

router.get("/main", canYouSeeIt, (req, res, next) => {
  console.log("req.session", req.session);
  res.render("cat");
});
router.get("/private", canYouSeeIt, (req, res, next) => {
  console.log("req.session", req.session);
  res.render("private");
});

module.exports = router;
