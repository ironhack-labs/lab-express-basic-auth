const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("signup.hbs");
});

router.get("/login", (req, res, next) => {
  res.render("login.hbs");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  //let user;

  User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        res.render("signup.hbs", {
          errorMessage: "Invalid credentials"
        });
        return;
      }

      user = foundUser;

      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      if (!match) {
        res.render("signup.hbs", { errorMessage: "Invalid credentials" });
        return;
      }
      // log user in

      // {"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"foo":{"_id":"5e3a78fa86c5cdcaebc8e80e","username":"user42","password":"$2b$10$CBqx55h.vIi6GtLUf2qGJeVXRGjbzEDT3LOwD0PwYzsI3V7EksInS","__v":0}}

      req.session.user = user;
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    res.render("signup.hbs", {
      errorMessage: "Username cannot be empty"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("signup.hbs", {
          errorMessage: "It already exists"
        });
        console.log("RETURN?");
        return;
      }
      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      if (!hash) return;
      return User.create({ username: username, password: hash });
    })
    .then(createdUser => {
      //console.log(createdUser);
      //console.log(req.session.user);
      if (!createdUser) return;

      req.session.user = createdUser;
      res.redirect("/");
    })
    .catch(err => {
      console.log("nonono");
      //next(err);
    });
});

module.exports = router;
