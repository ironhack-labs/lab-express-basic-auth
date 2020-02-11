var express = require("express");
var loginRouter = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

// GET     /login
loginRouter.get("/", (req, res) => {
  res.render("login");
});

// POST     /login
loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  if (password === "" || username === "") {
    res.render("login", {
      errorMessage: "Username and Password are required"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }

      const passwordFromDB = user.password;
      const passwordCorrect = bcrypt.compareSync(password, passwordFromDB);

      if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login-form", {
          errorMessage: "Incorrect password!"
        });
      }
    })
    .catch(err => console.log(err));
});

module.exports = loginRouter;