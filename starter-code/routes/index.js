const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
//signup Create
router.get("/signup", (req, res, next) => {
  res.render("signup");
});
router.post("/signup", (req, res, next) => {
  // const {
  //   username,
  //   password
  // } = req.body;
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  bcrypt.hash(password, 10, function (err, hash) {
    console.log(hash)
    if (err) next('hashing error')
    else {
      User.create({
          username: username,
          password: hash
        })
        .then(() => {
          res.redirect("/login");
        })
        .catch(error => {
          next(err.message)
          // console.log(error);
        })
    }
  })
});
//login
router.get("/login", (req, res, next) => {
  res.render("login");
});
router.post("/login", (req, res, next) => {
  // const {
  //   username,
  //   password
  // } = req.body;
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }
  User.findOne({
      username
    })
    .then((user) => {
      if (!user) res.send("no user.")
      bcrypt.compare(password, user.password, function (err, correctPassword) {
        if (err) next('hash compare error');
        else if (!correctPassword) res.send('wrong pass');
        else {
          req.session.currentUser = user;
          res.redirect('/main');
        }
      });
    })
    .catch((err) => {
      next(err.message)
      // res.send("Error, not logged in.")
    })
})

//main
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});
router.get("/main", (req, res, next) => {
  res.render("main");
});

//private
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});
router.get("/private", (req, res) => {
  res.render("private");
});

module.exports = router;