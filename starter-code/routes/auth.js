const express = require("express");
const router = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res) => {
  res.render('auth/signup');
})

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username == "" || password == "") {
    res.render("auth/signup", {
      errorMessage: "Please type your username and password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "This username already exists"
        })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPwd = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPwd
      })
        .then(() => { res.redirect("/") })
        .catch(error => { console.log(error) })
    })
    .catch(error => { next(error) })

})

module.exports = router