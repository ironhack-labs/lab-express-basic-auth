const express = require("express");
const router = express.Router(); // Router is like a lightweight app. You can use it exactly the same way except you can't listen on it. 
const User = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("views/signup.hbs");
})

router.post("/signup", (req, res) => {
  // const username = req.body.username;
  // const password = req.body.password;
  const {
    username,
    password
  } = req.body;
  User
    .create({
      username: username,
      password: password
    })
    .then((user) => {
      res.redirect("/user/login"); // instruct the browser to make a get request to /user/login (http://localhost:3000 is implicit)
    })
    .catch((err) => {
      res.send("user not created", err);
    })
})


router.get("/login", (req, res) => {
  res.render("user/login");
})

router.post("/login", (req, res) => {
  const {
    username,
    password
  } = req.body; // short hand notation for the uncommented code below
  // const username = req.body.username;
  // const password = req.body.password;
  User.findOne({
      username // short hand notation for {username: username}
    })
    .then((user) => {
      if (!user) res.send("invalid credentials.")
      else if (user.password !== password) res.send("invalid credentials.");
      else {
        // log the user in by starting a session;
        // redirect the user to a section of the site that is normally protected
        req.session.currentUser = user;
        res.redirect("/user/profile");
      }
    })
    .catch((err) => {
      res.send("Error, not logged in.")
    })
})

module.exports = router;