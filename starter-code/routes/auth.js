const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //Identify registered user
  if (username === "" || password === "") {
    return res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        return res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          return res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

//Get auth page
router.get("/signup", (req, res, next) => {
  return res.render("auth/signup");
});

//Login
router.get("/login", (req, res, next) => {
  return res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    return res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ username: theUsername })
    .then(user => {
      if (!user) {
        return res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        return res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
