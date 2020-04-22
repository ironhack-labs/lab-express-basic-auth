const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const zxcvbn = require("zxcvbn");

const strength = {
  0: "Catastrophic 💀",
  1: "Bad 😢",
  2: "Weak 👎🏻",
  3: "Good enough 👌",
  4: "Strong 🚀",
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
          error: "The user name already exists",
        });
      } else {
        User.create({
            username,
            password: hashPass,
          })
          .then((dbResponse) => {
            let score = zxcvbn(password).score.toString();
            let displayScore = strength[score].toLowerCase();
            res.render("auth/signup.hbs", {
              passwordStrength: `Your password is ${displayScore}`,
            });
          })
          .catch((dbErr) => {
            console.log(dbErr);
          });
      }
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
    username,
    password
  } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Please entre both user name and password to log in",
    });
  }

  User.findOne({
      username: username,
    })
    .then((user) => {
      if (!user) {
        res.render("/auth/login.hbs", {
          errorMessage: "Invalid credentials",
        });
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login.hbs", {
          errorMessage: "Invalid credentials",
        });
      }
    })
    .catch((dbErr) => {
      next(dbErr);
    });
});

module.exports = router;