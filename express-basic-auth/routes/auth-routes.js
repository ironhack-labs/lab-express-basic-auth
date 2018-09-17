const express = require('express');
const authRoutes  = express.Router();

const User = require("../models/user");

/* GET home page */
authRoutes.get('/', (req, res, next) => {
  res.render('index');
});

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

module.exports = authRoutes;

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
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
          res.redirect("/");
        })
        .catch(error => {
          next(error)
        })
    })
    .catch(error => {
      next(error)
    })
});


module.exports = authRoutes;
