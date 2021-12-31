const router = require("express").Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const saltRounds = 10;

router.get("/", isLoggedIn, (req, res, next) => {
  res.redirect("/private");
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main", { user: req.session.user.username });
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private", { user: req.session.user.username });
});

router.get("/login", isLoggedOut, (req, res, next) => {
  if (!req.session.user) {
    res.render("login");
  } else {
    res.render("index", { user: req.session.user.username });
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .render("login", { errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).render("login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .render("login", { errorMessage: "Wrong credentials." });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("login", { errorMessage: "Wrong credentials." });
        }
        console.log("BEFORE", req.session.user);
        req.session.user = user;
        console.log("AFTER", req.session.user);
        return res.redirect("/");
      });
    })

    .catch((err) => {
      next(err);
    });
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  console.log("NOOOO");
  if (!username) {
    return res
      .status(400)
      .render("signup", { errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).render("signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  User.findOne({ username }).then((found) => {
    if (found) {
      return res
        .status(400)
        .render("signup", { errorMessage: "Username already taken." });
    }

    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          password: hashedPassword,
        });
      })
      .then((user) => {
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("signup", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("signup", { errorMessage: error.message });
      });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render("logout", { errorMessage: err.message });
    }
    res.redirect("login");
  });
});

module.exports = router;
