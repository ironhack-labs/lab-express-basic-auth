const express = require('express');
const router = express.Router();
const User = require("../models/user");
const requireAuth = require("../middlewares/requireAuth");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/auth/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
      "username": username
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          password: hashPass
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        })
    })
    .catch(error => {
      next(error);
    })
})


router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({
      "username": theUsername
    })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Not valid credentials"
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Not valid credentials"
        });
      }
    })
    .catch(error => {
      next(error);
    })
});

router.get("/private", requireAuth, (req, res) => {
  res.render("private");
});

router.get("/main", requireAuth, (req, res) => {
  res.render("main");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});
module.exports = router;