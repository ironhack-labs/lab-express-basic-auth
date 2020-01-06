const express = require('express');
const router  = express.Router();

//Require user model
const User = require('../models/user');

//Require Bcrypt
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

//GET Signup page
router.get('/signup', (req, res, next) => {
  res.render('signup')
})

//POST SignUp Username and Password to Database
router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  //Checl if the username and password are empty - if yes, inform it to the user
  if (username === '' || password === '') {
    res.render('signup', {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  //Check if the username already exists
  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
        res.render('signup', {
          errorMessage: "The username already exists!"
        });
        return;
      }
  
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  
  //Create the username and password
  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    console.log("User Created Sucessfully");
    res.redirect('/')
  })
  .catch(error => {
    console.log(error);
  })
})
})

//GET Login Page
router.get('/login', (req, res, next) => {
  res.render('login')
})

//POST Login 
router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});


module.exports = router;