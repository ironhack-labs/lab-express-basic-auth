const express = require('express');
const loginRouter  = express.Router();

const User = require("./../models/User");

const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

loginRouter.post("/", (req, res) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {messageError: "You need to write user and password."})
    return;
  }

  User.findOne({username})
    .then( (user) => {
      if (!user) {
        res.render("auth/login", {messageError: "This user does not exists."});
        return;
      }

      const passwordDB = user.password;
      const passwordMatch = bcrypt.compareSync(password, passwordDB);

      if (passwordMatch) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {messageError: "Wrong password!!"});
      }
    })
    .catch( (err) => console.log(err));
});

loginRouter.get("/", (req, res) => {
  res.render("auth/login");
});

module.exports = loginRouter