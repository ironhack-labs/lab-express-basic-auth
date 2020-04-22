const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const zxcvbn = require("zxcvbn");

const strength = {
  0: "Worst",
  1: "Bad",
  2: "Weak",
  3: "Good",
  4: "Strong",
};

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home.hbs");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Please pick a user name and a password to create an account",
    });
  }

  User.findOne({
      username: username,
    })
    .then((user) => {
      if (user !== null) {
        res.render("auth/signup.hbs", {
          errorMessage: "The user name already exists",
        });
      }

      User.create({
          username,
          password: hashPass,
        })
        .then((dbResponse) => {
          res.redirect("/signup");
        })
        .catch((dbErr) => {
          console.log(dbErr);
        });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res, next) => {
  const {
    inputUsername,
    inputPassword
  } = req.body;

  if (inputUsername === "" || inputPassword === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Please entre both user name and password to log in",
    });
  }

  User.findOne({
      username: inputUsername,
    })
    .then((user) => {
      if (!user) {
        res.render("/auth/login.hbs", {
          errorMessage: "We couldn't find this user name",
        });
        return;
      }
      if (bcrypt.compareSync(inputPassword, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((dbErr) => {
      next(dbErr);
    });
});

module.exports = router;