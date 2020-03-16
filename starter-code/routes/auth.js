const express = require("express");
const router = express.Router();

const User = require("../models/user")

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup")
})

router.post("/signup", (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please include valid credentials"
    });
    return
  }
  User.findOne({
      username: username
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "User already exists, please input a different name"
        });
        return

      } else {

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt);

        User.create({
            username,
            password: hashPass
          })
          .then(() => {
            res.render("home", {
              message: "Welcome to the website!"
            });
          })
          .catch(error => {
            console.log(error);
          })
      }
    })
})


router.get("/login", (req, res, next) => {
  res.render("auth/login")
})

router.post("/login", (req, res, next) => {
  const inputUsername = req.body.username
  const inputPassword = req.body.password
  if (inputUsername === "" || inputPassword === "") {
    res.render("auth/signup", {
      errorMessage: "Please include valid credentials"
    });
    return
  }
  User.findOne({
      username: inputUsername
    })
    .then(user => {
      if (user === null) {
        res.render("auth/signup", {
          errorMessage: "No such user exists, please sign up"
        });
        return

      } else {
        if (bcrypt.compareSync(inputPassword, user.password)) {
          req.session.currentUser = user;
          res.render("home", {
            message: `Welcome back, ${inputUsername}!`
          })
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          })
        }
      }
    })
    .catch(error => next(error));
})

router.get("/logout", (req, res, next)=>{
req.session.destroy(err => res.redirect("/login"))
})

module.exports = router;