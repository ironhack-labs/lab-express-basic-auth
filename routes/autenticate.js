const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

/* para encriptar pass*/
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

/* GET signup page*/
router.get("/signup", (req, res, next) => {
  res.render("authenticate/signup");
});

/* POST signup page */
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("authenticate/signup", {
      errorMessage: "Indicate a username and a password to sign up.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("authenticate/signup", {
          errorMessage: "The username is already taken",
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPass })
      
    .then(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

/* GET login page*/
router.get("/login", (req, res, next) => {
  res.render("authenticate/login");
});

/* POST login page */
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("authenticate/login", {
      errorMessage: "Indicate a username and a password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("authenticate/login", {
          errorMessage: `User doesn't exists`,
        });
        return;
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("authenticate/login", {
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
