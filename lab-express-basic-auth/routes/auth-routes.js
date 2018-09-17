const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup")
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login")
});



authRoutes.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;


  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to signup"
    });
    return;
  }

  User.findOne({
      'username': username
    })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: "The username already exists"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        username,
        password: hashPass
      });

      newUser.save()
        .then(user => {
          res.redirect("/")
        })
    })
    .catch(error => {
      next(error);
    })
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

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        console.log('holaaa');
        
        req.session.currentUser = user;
        res.redirect("/private");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});



module.exports = authRoutes;