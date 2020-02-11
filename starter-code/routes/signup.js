var express = require("express");
var signupRouter = express.Router();
const User = require("./../models/User");

const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

signupRouter.post("/", (req, res, next) => {
  const { username, password } = req.body;

  if (password === "" || username === "") {
    res.render("signup", {
      errorMessage: "Username and Password are required"
    });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("signup", {
          errorMessage: "Username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashedPassword })
        .then(createUser => res.redirect("/"))
        .catch(err => {
          res.render("signup", {
            errorMessage: "Error while creating new user."
          });
        });
    })
    .catch(err => console.log(err));
});

//GET /login
signupRouter.get("/", (req, res) => {
  res.render("signup");
});

module.exports = signupRouter;
