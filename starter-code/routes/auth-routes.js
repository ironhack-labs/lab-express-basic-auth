const express = require("express");
const authRoutes = express.Router();
// User model
const User           = require("../models/User");
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authRoutes.get("/singup", (req, res, next) => {
  res.render("index");
});

authRoutes.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }).then(user =>{
    if(user){
      res.render("auth/signup", {
        errorMessage: "User already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
        username: username,
        password: hashPass
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e));
  });
})



module.exports = authRoutes;
