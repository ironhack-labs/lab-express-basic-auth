const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// requires User Model
const User = require("../models/user");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//LOGIN ROUTE
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

//SIGNUP ROUTE
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        username,
        password: hashPass
      });

      newUser.save().then(user => {
        res.redirect("/");
      });
    })
    .catch(error => {
      next(error);
    });
});

//ACTION INITIATED WHEN NOONE'S LOGGED IN
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

//PROTECTED ROUTES
router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

module.exports = router;
