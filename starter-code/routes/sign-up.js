var express = require("express");
var signUpRouter = express.Router();
const User = require("./../models/User");

const bcrypt = require("bcrypt");
const saltRounds = 15;

// POST '/'
signUpRouter.post("/", (req, res) => {
  const { username, password } = req.body;
  
  if (password === "" || username === "") {
    res.render("../views/sign-up.hbs", {
      errorMessage: "Username and Password are required"
    });
    return;
  }
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPw = bcrypt.hashSync(password, salt);
  User.create({username, password: hashedPw})
  .then(createdUser => {
    res.redirect("/")
  })
  .catch(err => {
    console.log(err)
    if(err.code === 11000) {
      res.render("../views/sign-up.hbs", {
        errorMessage: `Username already exists. Please <a href="/log-in">login</a>`
    })
  } else {
    res.render("../views/sign-up.hbs", {
      errorMessage: `Some error occured`
  }
  )};
  });
});

// GET    /sign-up
signUpRouter.get("/", (req, res) => {
  res.render("../views/sign-up.hbs")
});

module.exports = signUpRouter;