const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/auth");

/* GET home page */
router.get("/signup", (req, res, next) => {
  const { error } = req.query;
  switch (error) {
    case "Empty":
      res.render("auth/signup", { error: "Please fill in all the fields" });
      break;
    case "Exists":
      res.render("auth/signup", { error: "Username already exists" });
      break;
    default:
      res.render("auth/signup");
  }
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.redirect("/auth/signup?error=Empty");
    throw "Empty details entered";
  }

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.redirect("/auth/signup?error=Exists");
        throw "Username already exists";
      }
    })
    .then(() => {
      bcrypt.hash(password, 10).then(hash => {
        return User.create({
          username: username,
          password: hash
        }).then(user => {
          res.render("auth/signup-successful", { user });
        });
      });
    });
});

router.get("/login", (req, res, next) => {
  const { error } = req.query;
  switch (error) {
    case "User":
      res.render("auth/login", { error: "Username is incorrect" });
      break;
    case "Password":
      res.render("auth/login", { error: "Password is incorrect" });
      break;
    case "Empty":
      res.render("auth/login", { error: "Please fill in all the fields" });
      break;
    default:
      res.render("auth/login");
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  let theUser;

  if (username === "" || password === "") {
    res.redirect("/auth/login?error=Empty");
    throw "Empty details entered";
  }

  User.findOne({ username: username })
    .then(user => {
      theUser = user;
      if (!user) {
        res.redirect("/auth/login?error=User");
        throw "Username not found";
      }
      return bcrypt.compare(password, user.password);
    })
    .then(passwordCorrect => {
      if (!passwordCorrect) {
        res.redirect("/auth/login?error=Password");
        throw "Password incorrect";
      }
      req.session.user = theUser;
      console.log("Password correct");
      res.redirect("/auth/private");
    })
    .catch(e => next(e));
});

router.get("/private", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/private");
});

router.get("/main", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/main");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
