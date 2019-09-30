const express = require('express');
const router  = express.Router();
const User     = require("../models/users");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to login."
    });
    return;
  }

  User.findOne({ "name": theUsername })
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
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
})
})


router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    console.log('NAOPODE')
    res.render("signup", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.create({
    username,
    password: hashPass,
  })
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
});

module.exports = router;