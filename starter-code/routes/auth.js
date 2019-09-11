const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  //
  const { username, password, firstName } = req.body;

  if (password.length < 8) {
    res.render("signup", {
      message: "Your password must be 8 characters minimum"
    });
    return;
  }

  if (username === "") {
    res.render("signup", {
      message: "Your username cannot be empty"
    });
    return;
  }

  User.findOne({ username }).then(found => {
    console.log(`found: ${found}`);
    if (found) {
      res.render("signup", {
        message: "This username is already taken"
      });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash, firstName: firstName })
        .then(dbUser => {
          req.session.user = dbUser;
          res.redirect("/");
        })
        .catch(err => {
          console.log(err);
          next();
        });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }).then(found => {
    if (!found) {
      res.render("login", {
        message: "Invalid credentials. Please try again."
      });
      return;
    }

    if (bcrypt.compareSync(password, found.password)) {
      req.session.user = found;
      res.redirect("/");
    } else {
      res.render("login", {
        message: "Invalid credentials.Please try again."
      });
      return;
    }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    else res.redirect("/");
  });
});

module.exports = router;
