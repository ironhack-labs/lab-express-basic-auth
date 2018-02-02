const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const authRoutes = express.Router();
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({"username": username}).exec()
  .then(user => {
    if(user){
      console.log("Prueba: ", user.username);
      res.render("auth/signup", {errorMessage: "The username already exists"});
    }
  })
  .then(()=>{

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);
  
    var newUser  = User({
      username,
      password: hashPass
    });
  
  
    newUser.save()
    .then(()=>{
      res.redirect("/");
    })
    .catch(err => next(err))

  });



});


authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login', { title: "Login" });
});

authRoutes.post("/login", (req, res, next) => {
  const {username,password} = req.body;

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
        debug(`${user.username} is now logged in`);
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});


authRoutes.get('/logout',(req,res) => {
  req.session.currentUser = null;
  res.redirect('/');
})

module.exports = authRoutes;