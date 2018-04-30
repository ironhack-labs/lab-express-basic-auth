const express = require('express');
const authRoutes  = express.Router();
const bodyParser   = require('body-parser');

// User model
const User           = require("../models/user.js");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/* GET signup page */
authRoutes.get('/', (req, res, next) => {
  res.render('index');
});

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({username: username})
    .then(user => {
      console.log(user)
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      } 

        let newUser  = new User({
          username: req.body.username,
          password: hashPass
        });
        console.log(newUser)
        newUser.save()
        .then(user => {
          res.render("auth/login");
        })
        .catch(error => {
          console.log(error);
          
        })
    })
    .catch(error => {
      console.log(error)
    })

  
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({username: username})
    .then(user => {
      if (!user) {
        res.render("auth/signup", {
          errorMessage: "The username doesn't exists"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.render("protected/main");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      } 
    })
    .catch(error => {
      console.log(error)
    })

   
  
});

module.exports = authRoutes;
