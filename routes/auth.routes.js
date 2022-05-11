const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const { redirect } = require("express/lib/response");

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.get("/main", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", { errorMessage: "All fields are required" });
  }

  if (password.length < 6) {
    res.status(500).render("auth/signup", {
      errorMessage: "Password must contain at least 6 characters",
    });
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render("auth/signup", { errorMessage: "Username already exists" });
      }
    })
    .catch((err) => next(err));

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((passwordHash) => {
      return User.create({
        username,
        passwordHash,
      });
    })
    .then(() => res.redirect("/"))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: err.message });
      } else if (err.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username needs to be unique. Either one of them is already in use",
        });
      } else {
        next(err);
      }
    });
});

router.get("/login", isLoggedOut, (req, res, next) => res.render("auth/login"));

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", { errorMessage: "All fields are required" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "User not found" });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        req.app.locals.currentUser = user;

        // res.render("index", { user });
        res.redirect("/");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password" });
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
