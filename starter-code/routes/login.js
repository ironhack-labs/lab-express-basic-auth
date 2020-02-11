const express = require("express");
const loginRouter = express.Router();
const User = require("./../models/users");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login-form", {
      errorMessage: "Username and Password cannot be empty"
    });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render("auth/login-form", {
          errorMessage: "Username does not exist"
        });
        return;
      }
      const passwordDB = user.password;
      const isPasswordCorrect = bcrypt.compareSync(password, passwordDB);

      if (isPasswordCorrect) {
        console.log("isPasswordCorrect :", isPasswordCorrect);
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login-form", {
          errorMessage: "Incorrect username/password combination"
        });
      }
    })
    .catch(err => {});
});

loginRouter.get("/", (req, res) => {
  res.render("auth/login-form");
});

module.exports = loginRouter;
