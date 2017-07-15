const express = require('express');
const router = express.Router();


const User = require('../models/user');
const bcrypt = require('bcrypt');


const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

saltRounds = 10;


router.get('/sign-up', (req, res, next) =>{
  res.render('sign-up', {message: ""});
});

// Sign-up
router.post('/sign-up', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  //Previous functions 

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {    
     return res.render('sign-up'),{message: "User already exists"};
    }

  let salt = bcrypt.genSaltSync(saltRounds);
  let hashPass = bcrypt.hashSync(password, salt);
  
  let newUser = User({
    username: username,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/");
    });
  });
});

router.get('/login', (req, res, next) => {
  console.log('Login');
  res.render('index', { "message": req.flash("error") });
});

router.get('/secret', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('secret', { user: req.user });
});


//passport

function pass(req, res, next) {
  console.log('post login');
  next();
}

router.post("/login", pass, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = router;