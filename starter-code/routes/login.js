const express = require("express");
var loginRouter = express.Router();
const User = require("./../models/User");


//GET /login

loginRouter.get("/", (req, res) => {
  res.render("login");
});

//POST   /login
loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  if(password === "" || username === "") {
    res.render("login", {
      errorMessage: "Username and Password are required"
    });
    return;
  }

  User.findOne({username})
  .then( user => {
    if (!user) {
      res.render("login", {
        errorMessage: "The username doesn't exist."
      });
      return;
    }

    if (passwordCorrect) {
      //Saves login session
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("login", {
        errorMessage: "Incorrect password!"
      });
    }
  })
  .carch(err => console.log(err));
});


module.exports = loginRouter;