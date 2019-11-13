const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  const pwl = 10;

  if (!username)
    return res.render("auth/signup", { message: "Username can't be empty" });

  if (!password)
    return res.render("auth/signup", { message: "Password can't be empty" });

  if (password.length < pwl)
    return res.render("auth/signup", {
      message: `Password length should be not less than ${pwl}`
    });

  User.findOne({ username })
    .then(foundUser => {
      if (foundUser)
        return res.render("auth/signup", {
          message: `Username ${foundUser.username} is already taken`
        });

      bcrypt
        .genSalt()
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ username: username, password: hash }))
        .then(newUser => {
          console.log(newUser);
          req.session.user = newUser; // add newUser to session
          res.redirect("/");
        });
    })
    .catch(err => next(err));
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(foundUser => {
      if (!foundUser)
        return res.render("auth/login", {
          message: "Invalid credentials"
        }); // User not found

      bcrypt.compare(password, foundUser.password).then(exist => {
        if (!exist)
          return res.render("auth/login", {
            message: "Invalid credentials"
          }); // The password doesn't match

        // Log the user in
        req.session.user = foundUser;
        res.redirect("/private");
      });
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.clearCookie("connect.sid");
      res.redirect("/");
    }
  });
});

module.exports = router;
