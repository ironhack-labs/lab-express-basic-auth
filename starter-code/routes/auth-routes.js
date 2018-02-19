var express = require('express');
var authRoutes = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt"); 
const bcryptSalt = 10; 
const zxcvbn = require('zxcvbn');

authRoutes.get('/signup', (req, res, next) => {
    res.render('auth/signup', {title: "Sign Up"});
})

authRoutes.post('/signup', (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;

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
  
      var test = zxcvbn(password);
      console.log(test)
      if(test.score < 4){
        res.render("auth/signup", {
          errorMessage: "Password Weak, Try Another Password"
        });
        return;
      }
      
      
      var salt     = bcrypt.genSaltSync(bcryptSalt);
      var hashPass = bcrypt.hashSync(password, salt);
  
      var newUser = User({
        username,
        password: hashPass
      });
  
      newUser.save((err) => {
        res.redirect("/");
      });
    });
});

authRoutes.get('/login', (req, res, next) => {
    res.render("auth/login", {title: "Login"})
})

authRoutes.post('/login', (req, res, next) => {
  const username = req.body.username; 
  const password = req.body.password; 

  if(username === "" || password ===""){
      res.render('auth/login', 
      {errorMessage: "Indicate a username and a password"
    });
    return
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
      console.log(req.session)
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = authRoutes;