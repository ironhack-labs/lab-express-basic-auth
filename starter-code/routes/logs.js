const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const Logs = require("../models/logs");

router.get("/login", (req, res) => {
  res.render("logs/login", {
    error: req.flash("error"),
  });
});

router.post('/login', (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  Logs.findOne({
      username: username
    })
    .then((dbSuccess) => {
      if (!dbSuccess) {
        req.flash("error", "No Username")
        res.redirect("/logs/login");
      } else {
        if (bcrypt.compareSync(password, foundUser.password)) {
          req.session.currentUser = foundUser;
          res.redirect("/")
        } else {
          req.flash("error", "No Passwd")
          res.redirect("/logs/login")
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get("/register", (req, res) => {
  res.render("logs/register", {
    error: req.flash("error")
  })
})

router.post("/register", (req, res) => {
  const {
    username,
    password
  } = req.body
  Logs.findOne({
      username: username
    })
    .then((dbFoundUser) => {
      if (dbFoundUser) {
        req.flash("error", "Username already used")
        res.render("/logs/register")
      } else {
        const salt = 10;
        const hashedPasswd = bcrypt.hashSync(password, salt)
        const newRegister = {
          username,
          password: hashedPasswd
        }
        Logs.create(newRegister)
          .then((dbNewUser) => {
            res.redirect("/logs/login")
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  })
})

module.exports = router;