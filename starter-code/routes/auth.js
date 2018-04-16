const express = require('express');
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcrypt')

const bcryptSalt = 10;



router.get('/', (req, res, next) => { //  / = /auth
  res.render('auth/auth');
});

/* GET register page */
router.get('/signup', (req, res, next) => { //  / = /auth
  res.render('auth/signup');
});

router.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ "username": username },
    "username",
    (err, user) => {
      if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });

});

router.get('/login', (req, res, next) => { //  / = /auth
  res.render('auth/login');
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

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        console.log({user});
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("login");
  }
});

router.get("/private", (req, res, next) => {
  res.render("auth/private");
});

module.exports = router;