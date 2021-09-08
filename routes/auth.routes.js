const router = require("express").Router();

const User = require("../models/User.model");

const mongoose = require("mongoose");

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log(`User created`);
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("user/user-profile", { userInSession: req.session.currentUser });
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage:
            "User or Password are not correct. Please try another time.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", {
          errorMessage:
            "User or Password are not correct. Please try another time.",
        });
      }
    })
    .catch((error) => next(error));
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

router.get("/main", isLoggedIn, (req, res) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private");
});

module.exports = router;
