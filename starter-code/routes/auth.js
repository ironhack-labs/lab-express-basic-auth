let express = require("express");
let router = express.Router();
let bcrypt = require("bcrypt");
let User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("signup.hbs");
});

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username) {
    res.render("signup.hbs", { errorMessage: "Please enter username" });
    return;
  }
  if (password.length < 6) {
    res.render("signup.hbs", {
      errorMessage: "Password must be at least 6 characters"
    });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("signup.hbs", {
          errorMessage: "Username already taken. Please try a new one"
        });
        return;
      }

      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      return User.create({ username: username, password: hash });
    })
    .then(createdUser => {
      console.log(createdUser);
      req.session.user = createdUser;
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("login.hbs");
});

router.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  let user;

  User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        res.render("login.hbs", { errorMessage: "Invalid Credentials" });
        return;
      }

      user = foundUser;

      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      if (!match) {
        res.render("login.hbs", { errorMessage: "Invalid Credentials" });
        return;
      }

      req.session.user = user;
      res.redirect("/");
    });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
