const express = require("express");
const User = require("../models/User.model");

const router = express.Router();

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.get("/signup", function (req, res, next) {
  res.render("signup", {});
});

router.post("/signup", function (req, res, next) {
  const passwordHash = bcrypt.hashSync(req.body.password, salt);

  new User({
    username: req.body.username,
    password: passwordHash,
  })
    .save()
    .then(function () {
      res.send("New user created");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/login", function (req, res, next) {
  res.render("login", {});
});

router.post("/login", function (req, res, next) {
  User.findOne({ username: req.body.username }).then(function (userfromDB) {
    console.log(userfromDB);

    if (userfromDB) {
      if (bcrypt.compareSync(req.body.password, userfromDB.password)) {
        req.session.currentUser = userfromDB;
        res.redirect("/main");
      } else {
        res.render("login", {
          errorMessage: "Wrong credentials",
        });
      }
    } else {
      res.render("login", {
        errorMessage: "User doesn't exist",
      });
    }
  });
});

router.get("/main", function (req, res, next) {
  if (req.session.currentUser) {
    // res.send("Ok")
    res.render("main", { username: req.session.currentUser.username });
  } else {
    res.redirect("/login");
  }
});

router.get("/private", function (req, res, next) {
    if (req.session.currentUser) {
      res.render("private", { username: req.session.currentUser.username });
    } else {
      res.redirect("/login");
    }
  });

module.exports = router;
