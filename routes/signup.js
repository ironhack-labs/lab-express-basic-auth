const express = require("express");
const router = express.Router();
const Signup = require("../models/User.js");
const bcrypt = require("bcrypt");
const brcyptSalt = 10;

router.get("/", (req, res, next) => {
  res.render("signup");
  //res.render("signup", { title: "Sign up", signup });
});

router.post("/", (req, res, next) => {
  const { name, password } = req.body;
  Signup.findOne({
    name
  })
    .then(user => {
      if (user !== null) {
        throw new Error("Username already exists.");
      }
      
      const salt = bcrypt.genSaltSync(brcyptSalt);
      console.log(password)
      const hashPass = bcrypt.hashSync(password, salt);
      
      const newUser = new Signup({
        name,
        password: hashPass
      });
      console.log(`estoy `)
      return newUser.save();
    })
    .then(userName => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("signup", {
        errorMessage: err.message
      });
    });
});
module.exports = router;
