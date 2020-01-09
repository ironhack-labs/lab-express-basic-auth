const express = require('express');
const router  = express.Router();

const User = require("../models/user");

const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (reg, res, next) => {
    res.render('auth/signup');
})

router.post("/signup", (req, res, next) => {
    console.log("post: /signup");
    const username = req.body.username;
    const password = req.body.password;
    if (username === "" || password === "") {
      res.render("auth/signup", {
        errorMessage: "Please enter both, username and password to sign up."
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    User.findOne({ username: username })
      .then(user => {
        if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists!"
          });
          return;
        }
        User.create({
          username,
          password: hashPass
        })
          .then(() => {
            res.redirect("/");
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        next(error);
      });
  });


module.exports = router;