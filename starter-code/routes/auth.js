const express = require('express');
const router = express.Router();
//const User = require('../models/User');

router.get('/home', function(req, res, next) {
    res.render('auth/home');
});

router.get('/private', function(req, res, next) {
    if(req.session.currentUser){
        res.render('private', { title: 'Private' });
    }
    res.redirect('/auth/home');
});

router.post("/login", (req, res, next) => {
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

module.exports = router;