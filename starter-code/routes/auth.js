const express = require("express");
const router  = express.Router();
const bcrypt = require('bcrypt')
const User = require ("../models/User")

router.get('/signup', (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!password || !username) {
    res.render("auth/signup", { errorMessage: "Both fields are required" });

    return;
  } else if (password.length < 8) {
    res.render("auth/signup", {
      errorMessage: "Password needs to be 8 characters min"
    });

    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "This username is already taken"
        });

        return;
      }
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      return User.create({
        username,
        password: hash
      }).then(data => {
        res.redirect("/");;
      });
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("auth/login", { errorMessage: "Both fields are required" });

    return;
  }
  User.findOne({ username }).then(user => {
    if (!user) {
      return res.render("auth/login", { errorMessage: "Invalid credentials" });
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect("/");
    } else {
      res.render("auth/login", { errorMessage: "Invalid credentials" });
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

module.exports = router;