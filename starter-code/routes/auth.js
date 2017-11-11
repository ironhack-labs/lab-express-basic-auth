var express = require('express');
var router = express.Router();
var User           = require("../models/user");
var bcrypt         = require("bcrypt");
var bcryptSalt     = 10;


//login*********************

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});
  

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  
  User.findOne({ "username": username }, (err, user) => {
      if (err) {
          next(err);
      }
      else if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
      }
      else if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/auth/main");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

//signup******************
router.get('/signup', function(req, res, next) {
  // res.send('respond with a singup form');
  res.render('auth/signup');
});

router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  
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
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser  = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect("/auth/login");
    });
  });
});


//signup******************
router.get('/main', function(req, res, next) {
  // res.send('respond with a singup form');
  if(req.session.currentUser) {
    res.render('auth/main');
  } else { 
    res.redirect("/auth/login");
  }
});

module.exports = router;