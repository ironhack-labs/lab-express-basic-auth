const express = require("express");
const authRouter = express.Router();
const User = require("./../models/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const isLoggedIn = require("./../utils/middleware");

//Create route signup
authRouter.get("/", (req, res, next) => {
  res.render("signup");
});

authRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("signup", { errorMessage: "Please try again 1" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("signup", { errorMessage: "Please try again 2" });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashedPassword })
        .then(() => res.redirect("/"))
        .catch((err) => {
          res.render("signup", { errorMessage: "Please try again 3" });
          return;
        });
    })
    .catch((err) => {
      res.render("signup", { errorMessage: "Please try again 4" });
      return;
    });
});

// Create route login

authRouter.get("/login", (req, res, next) => {
  res.render("login");
});

authRouter.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("signup", { errorMessage: "Please try again 5" });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, user.password);
      if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect("/");
      }
    })

    .catch((err) => {
      res.render("signup", { errorMessage: "Please try again 6" });
      return;
    });
});

// Create main Route
authRouter.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});

authRouter.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});

//Export
module.exports = authRouter;
