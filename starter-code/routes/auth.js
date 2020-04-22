const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("signup");
});

//iteration 1 - signup
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    res.render("signup", {
      message:
        "Your password must be at least 6 characters in length and include !",
    });
    return;
  }
  if (username === "") {
    res.render("signup", { message: "Your username cannot be empty" });
    return;
  }

  // check if username already exists
  User.findOne({ username: username }).then((exists) => {
    if (exists !== null) {
      res.render("signup", { message: "Username already exists" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash })
        .then((dbUser) => {
          // login the user
          res.redirect("/login");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

//iteration 2 login
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).then((exists) => {
    if (exists === null) {
      res.render("login", { message: "Invalid credentials" });
      return;
    }
    if (bcrypt.compareSync(password, exists.password)) {
      req.session.user = exists;
      res.redirect("/profile");
    } else {
      res.render("login", { message: "Invalid credentials" });
    }
  });
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      console.log("You have logged in succesfully");
      next();
    } else {
      res.redirect("login");
    }
  };
};

module.exports = router;
