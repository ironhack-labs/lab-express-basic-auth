const express = require("express");
const loginRouter = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

loginRouter.get("/", (req, res) => {
  res.render("auth/login-form");
});

loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;
  if (password === "" || username === "") {
    res.render("auth/login-form", {
      errorMessage: "Username/Password required"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render("auth/login-form", { errorMessage: "The username does not exist" });
        return;
      }
      const databasePW = user.password;
      const correctPW = bcrypt.compareSync(password, databasePW);

      if (correctPW) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login-form", { errorMessage: "Wrong Password!" });
      }
    })
    .catch(err => console.log(err));
});

module.exports = loginRouter;
