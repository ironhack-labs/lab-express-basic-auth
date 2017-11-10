var express = require('express');
var router = express.Router();

// User model
const User = require("../models/user").User;

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// -- auth

router.get('/', function (req, res, next) {
  res.send('test');
});

// -- login 

router.get('/login', function (req, res, next) {
  res.render('auth/login');
});

router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

User.findOne({
    "username": username
  }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
  // res.send('respond with a resource');
});

// -- signup

router.get('/signup', function (req, res, next) {
  res.render('auth/signup');
});

router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);


  User.findOne({
      "username": username
    },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }

      var newUser = User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });
});

//Protected
router.get("/main", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/private", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/auth/login");
  }
});



module.exports = router;