const express = require("express");
const router = express.router();
module.exports = router;
const bcrypt = require("bcrypt");

const User = require("../models/User");

router.get("/signup", (res, req) => {
  res.render("signup");
});

router.post("/signup", (res, req, next) => {
  const { username, password, email } = req.body;
  if (password.length < 6) {
    res.render("signup", { message: "Your password is too short " });
    return;
  }
  if (username === "") {
    res.render("signup", { message: "The fields can't be empty" });
    return;
  }
  if (!email.includes("@")) {
    res.render("signup", { message: "The Email is not valid" });
    return;
  }
  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render("signup", { message: "The username can't be repeated" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
    }

    User.create({ username: username, password: hash, email: email })
      .then((dbUser) => {
        res.redirect("/login");
      })
      .catch((error) => {
        next(error);
      });
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).then((found) => {
    if (found === null) {
      res.render("/login", { message: "Username not found" });
      return;
    }
    if (bcrypt.compareSync(password, found.password)) {
      req.session.user = found;
      req.redirect("/userprofile");
    } else {
      res.render("/login", { message: "Invalid User" });
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) next(error);
    else res.redirect("/");
  });
});
