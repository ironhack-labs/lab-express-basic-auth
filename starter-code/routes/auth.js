const express = require("express");
const authRouter = express.Router();
const User = require("./../models/users");

const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

authRouter.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("auth/signup-form", {
      errorMessage: "Username and password cannot be empty"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/signup-form", {
          errorMessage: "Username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      User.create({ username, password: hashedPassword })
        .then(createUser => res.redirect("/"))
        .catch(err => {
          res.render("auth/signup-form", {
            errorMessage: "Error while creating the new user."
          });
        });
    })
    .catch(err => {
      console.log(err);
    });
});

authRouter.get("/", (req, res, next) => {
  res.render("auth/signup-form");
});

module.exports = authRouter;
