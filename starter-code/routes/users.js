const express = require("express");
const app = express();
// const router = express.Router();
const User = require("../models/User");

////SIGN UP

app.get("/signup", (req, res) => {
  res.render("users/signup.hbs");
});

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.create({
    username: username,
    password: password
  })
  .then(user => {
    res.redirect("/protected/main");
  })
  .catch(error => {
    console.log(error);
  })
});


//////LOGIN
app.get("/login", (req, res, next) => {
  res.render("users/login.hbs");
});


app.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("users/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User
  .findOne({ "username": username })
  .then((user) => {
      if (!user) {
        res.render("users/login", {
          errorMessage: "Invalid credentials"
        })
      }
      else if (user.password !== password){
        res.render("users/login", {
          errorMessage: "Invalid credentials"
        })
      }
      else{ 
        req.session.currentUser = user;  
        res.redirect("/main")
      }
  })
  .catch(error => {
    next(error);
  })
});

module.exports = app;
