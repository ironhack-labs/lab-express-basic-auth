const express = require('express');
const router  = express.Router();
// User model
const User           = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/* GET signup page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

/* POST signup page */
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  //check if username or password are empty
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  //check if username already exists
  User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
      return;
      }
    })
  //generate hashpassword
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  //create new user
  const newUser  = User({
    username,
    password: hashPass
  });
  //save new user to database
  newUser.save()
    .then(user => {
      res.redirect("/");
    })
    .catch(error => {
      next(error);
    })
  });

/* GET login page */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

/* POST login page */
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
          errorMessage: "The username doesn't exist"
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

module.exports = router;
