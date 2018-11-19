const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const saltRounds = 10;
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("../views/signup.hbs");
});

router.get("/login", (req, res, next) => {
  res.render("../views/login.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username == "" || password == "") {
    res.render("../views/signup.hbs", {
      error: "Username and password needed"
    });
  } else {
    User.findOne({ username: username }, "username").then(data => {
      console.log(data);
      if (data == null) {
        console.log("hola");
        const salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(username, salt);
        userdata = { username: username, password: hash };
        user.create(userdata).then(() => {
          res.redirect("/");
        });
      } else {
        res.render("../views/signup.hbs", { error: "Username already taken" });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("../views/login", {
      error: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("../views/login", {
        error: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("../views/login", {
        error: "Incorrect password"
      });
    }
  });
});

module.exports = router;
