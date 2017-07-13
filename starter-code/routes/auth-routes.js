const express = require("express");
const authRoutes = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get('/', function(req, res, next) {
  res.render('index');
});

authRoutes.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("auth/signup",{
        errorMessage: "The username already exists"
      });
      return;
    }

    new User({
      username: username,
      password: hashPass
    }).save((err) => {
      if (err) {
        res.render("auth/singup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("/login");
      }
    });
  });
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

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login",{
          errorMessage: "The username doesn't exists"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/main");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    });
});

authRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});


authRoutes.get("/private", (req, res, next) => {
  res.render("private");
});

authRoutes.get("/main", (req, res, next) => {
  res.render("main");
});

authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = authRoutes;
