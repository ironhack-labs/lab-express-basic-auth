const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//メインページからのサインアップのルート
router.get("/signup", (req, res, next) => {
  res.render("signup.hbs");
});
//メインページからのログインのルート
router.get("/login", (req, res) => {
  res.render("login.hbs");
});
//ログアウト
router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

//ログインの内容

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  let user;

  User.findOne({ username: username })
    .then(foundUser => {
      // if (foundUser === null)
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

      req.session.user = user;

      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

//サインアップの内容
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    res.render("signup.hbs", {
      errorMessage: "The fields can't be empty"
    });
    return;
  }
  if (password.length < 6) {
    res.render("signup.hbs", {
      errorMessage: "Password must be 6 char. min"
    });
    return;
  }

  // User.findOne({ username });
  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("signup.hbs", {
          errorMessage: "The username is already taken"
        });
        return;
      }

      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      return User.create({ username: username, password: hash });
    })
    .then(createdUser => {
      //console.log(createdUser);

      req.session.user = createdUser;

      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
