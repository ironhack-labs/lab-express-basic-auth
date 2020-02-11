const express = require('express');
const authRouter  = express.Router();

const User = require("./../models/User");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

authRouter.post("/", (req, res) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {messageError: "You need to write user and password."})
    return;
  }

  User.findOne({username})
    .then( (user) => {
      if (user) {
        res.render("auth/signup", {messageError: "This user already exists."});
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
    
      User.create({username, password: hashedPassword})
        .then( (user) => {
          res.redirect("/");
        })
        .catch( (err) => {
          res.render("/auth/signup", {messageError: "Error while creating the user."})
        });
    })
    .catch( (err) => console.log(err));
  
})

authRouter.get("/", (req, res) => {
  res.render("auth/signup");
})

module.exports = authRouter