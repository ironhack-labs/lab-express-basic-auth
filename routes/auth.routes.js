const router = require("express").Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("auth/signup", {
      errorMessage: "All fields are required",
    });
  }
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({ username, password: hashedPassword });
    })
    .then((user) => {
      req.session.currentUser = user;
      req.app.locals.currentUser = user;
      console.log(req.session);
      res.redirect("/");
    })
    .catch((err) => next(err));
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("auth/login", {
      errorMessage: "All fields are required",
    });
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.render("auth/login", { errorMessage: "User not found" });
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        req.app.locals.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password" });
      }
    })
    .catch((err) => next(err));
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
