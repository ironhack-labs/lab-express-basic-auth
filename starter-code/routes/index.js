const express = require('express');
const router = express.Router();
const User = require("../models/user");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
//signup Create
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", (req, res) => {
  const {
    username,
    password
  } = req.body;
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.create({
      username,
      password
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch(error => {
      console.log(error);
    })
});
//login
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res) => {
  const {
    username,
    password
  } = req.body;
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
      if (!user) res.send("invalid credentials.")
      else if (user.password !== password) res.send("invalid credentials.");
      else {
        req.session.currentUser = user;
        res.redirect("/main");
      }
    })
    .catch((err) => {
      res.send("Error, not logged in.")
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