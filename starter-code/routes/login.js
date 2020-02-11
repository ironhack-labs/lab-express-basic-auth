const express = require("express");
const loginRouter = express.Router();
const User = require("./../models/User");

const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  if (password === "" || username === "") {
    res.render("login", {
      errorMessage: "Username and password are required."
    });
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
        req.session.currentUser = user; // to send cookies. omnomnom.
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password!"
        });
      }
    })
    .catch(err => console.log(err));
});

loginRouter.get("/", (req, res) => {
  res.render("login");
});

module.exports = loginRouter;
