const express = require('express');

const Register = require('../models/register.js')
const bcrypt     = require("bcrypt");
const authRoutes = express.Router();
const User = require('../models/register');

const saltRounds = 10;
//Registro
authRoutes.get("/signup", (req, res, next) => {
  res.render("signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  
  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    
  
  })
.catch(error => {
    next(error)
})

const newUser  = User({
  username,
  password: hashPass
});

   newUser.save()
  .then(user => {
    res.redirect("/");
  })
});



authRoutes.get("/login", (req, res, next) => {
  res.render("login");

});

authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        //res.redirect("/");
        res.redirect("/main");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    console.log(error);
  })
});

authRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});
authRoutes.get("/private", (req, res, next) => {
  console.log("Entra")
  res.render("private");
});

authRoutes.get("/main", (req,res) => {
  res.render("main")
})







module.exports = authRoutes;
