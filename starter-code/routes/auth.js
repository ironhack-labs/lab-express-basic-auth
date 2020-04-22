const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }

  User.findOne({ username: username }).then((user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username is already taken",
      });
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
        username: username,
        password: hashPass,
      })
        .then((user) => {
          console.log("User has been created", user.username);
          //Send or render somewhere
          res.redirect("/login");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  ///Is username created
  User.findOne({ username: username }).then((user) => {
    if (user === null) {
      res.render("auth/login", { errorMessage: "Invalid credentials" });
      return;
    }
    ///Do username and password match
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect("/main");
    } else {
      res.render("auth/login", { errorMessage: "Invalid credentials" });
    }
  });
});




module.exports = router;
