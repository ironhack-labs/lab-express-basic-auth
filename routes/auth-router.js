const express = require("express");
const authRouter = express.Router();
const User = require("./../models/user-model");
const zxcvbn = require("zxcvbn");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//ITERATION 1 - SIGNUP
// get
authRouter.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form");
});

//post
authRouter.post("/signup", (req, res, next) => {
  const { password, username } = req.body;
  if (username === "" || password === "") {
    res.render("auth-views/signup-form", {
      errorMessage: "Enter username and password",
    });
    return;
  }

  // Check if username exists
  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("auth-views/signup-form", {
          errorMessage: "error, try again",
        });

        return;
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      // create user
      User.create({ username, password: hashedPassword })
        .then((createdUser) => {
          res.redirect("/");
          console.log(User);
        })
        .catch((err) => {
          console.log(err);
          res.render("auth-views/signup-form", {
            errorMessage: "error,try again!",
          });
        });
    })
    .catch((err) => next(err));
});

// ITERATION 2 - LOGIN PART

authRouter.get("/login", (req, res, next) => {
  res.render("auth-views/login-form");
});

authRouter.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth-views/login-form", {
      errorMessage: "enter username and password",
    });

    return;
  }

  // Check if username exists
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth-views/login-form", {
          errorMessage: "Indicate username and password",
        });

        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, user.password);

      if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth-views/login-form", {
          errorMessage: "enter username and password",
        });
      }
    })
    .catch((err) => console.log(err));
});

module.exports = authRouter;
