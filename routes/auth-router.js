const express = require("express");
const authRouter = express.Router();
const User = require("./../models/user-model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

authRouter.get("/signup", (req, res, next) => {
  res.render("auth-views/signup");
});

authRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("auth-views/signup", {
      errorMessage: "Please enter username and password",
    });
    return;
  }

  User.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render("auth-views/signup-form", {
        errorMessage: "There was an error, try again",
      });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPW = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashedPW })
      .then((createdUser) => {
        res.redirect("/");
      })
      .catch((err) => {
        res.render("auth-views/signup", {
          errorMessage: "There was an error try again!",
        });
      })
      .catch((err) => next(err));
  });
});

authRouter.get("/login", (req, res, next) => {
  res.render("auth-views/login");
});

authRouter.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("auth-views/login", {
      errorMessage: "Please enter username and password",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth-views/login", {
          errorMessage: "Username taken, try again",
        });
        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, user.password);
      if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth-views/login", {
          errorMessage: "Error please try again",
        });
      }
    })
    .catch((err) => next(err));
});

module.exports = authRouter;
