const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", { errorMessage: "All fields are required" });
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password must contain at least 6 characters, one uppercase, one lowercase and one special character",
    });
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((user) => {
      req.session.currentUser = user;
      req.app.locals.currentUser = user;
      res.redirect("/profile");
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: err.message });
      } else if (err.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Username must be unique. Choose another and try again",
        });
      } else {
        next(err);
      }
    });
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", { errorMessage: "All fields are required" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "User not found. You have to create a new account!",
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        req.app.locals.currentUser = user;

        console.log(req.session);
        res.render("profile", { user });
      } else {
        res.render("auth/login", { errorMessage: "incorrect password" });
      }
    })
    .catch((err) => next(err));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
