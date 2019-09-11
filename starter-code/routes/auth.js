const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/User");

// write the get /signup route to show a form
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", (req, res, next) => {
  //   console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  // const { username, password } = req.body;

  // check if the password is long enough and username is not empty
  if (password.length < 8) {
    res.render("signup", { message: "Your password must be 8 char. min." });
    return;
  }
  if (username === "") {
    res.render("signup", { message: "Your username cannot be empty" });
    return;
  }

  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render("signup", { message: "This username is already taken" });
    } else {
      // we can create a user with the username and password pair
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
          res.redirect("/");
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then(found => {
    if (found === null) {
      // no user in the collection has this username
      res.render("login", { message: "Invalid credentials" });
      return;
    }
    if (bcrypt.compareSync(password, found.password)) {
      // password and hash match
      req.session.user = found;
      res.redirect("/");
    } else {
      res.render("login", { message: "Invalid credentials" });
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