const express = require('express');
const router  = express.Router();
const User    = require("../models/user");
const bcrypt  = require("bcrypt");
const bcryptSalt = 10;
const zxcvbn = require('zxcvbn')
 
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password =req.body.password;

    if (username === "" || password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }

    if (zxcvbn(password).score < 1) {
      res.render('auth/signup', {
        message: `You have a weak password it was cracked at the ${zxcvbn(password).guesses} attempt.`
      })
      return
    }

    User.findOne({"username": username})
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: `The username ${username} already exists!`
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User ({
        username,
        password: hashPass
      });

      newUser.save()
      .then (user => {
        res.redirect("/");
      })
    })
    .catch(error => {
      next(error);
    })
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: `The username ${username} doesn't exist`
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
