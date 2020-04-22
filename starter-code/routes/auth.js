const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (password.length === "") {
    res.render('signup', { message: 'Your password cannot be empty' });
    return;
  }
  if (username === '') {
    res.render('signup', { message: 'Your username cannot be empty' });
    return;
  }
  // check if username already exists
  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render('signup', { message: 'Username is already taken' });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
          // login the user
          res.redirect('/login');
        })
        .catch(err => {
          next(err);
        });
    }
  })
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;
  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/private");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

// router.get('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) next(err);
//     else res.redirect('/');
//   });
// });

module.exports = router;