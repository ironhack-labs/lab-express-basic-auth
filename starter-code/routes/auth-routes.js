const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user-model");
// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
//Use zxcvbn to enforce password strenght
const zxcvbn         = require('zxcvbn');

//Bonus - Password Strength Measurement
const Recaptcha = require('express-recaptcha').Recaptcha;
const recaptcha = new Recaptcha('6Lccdo8UAAAAAIhKr0zf4bYmjcQ09r6QKzkoGd61','6Lccdo8UAAAAAGJFpua4w3Hs74Myq1lh83JmO1O9');

//Iteration 1 - Sign Up
router.get("/signup", recaptcha.middleware.render, (req, res, next) => {
  res.render("auth/signup", { captcha:res.recaptcha });
});

//Post request ====> http://localhost:3000/signup
router.post('/signup', recaptcha.middleware.verify, (req,res, next) =>{
  if (!req.recaptcha.error){
  const username = req.body.username;
  const password = req.body.password;
  if( username == ""|| password == ""){
    res.render('auth/signup', { errorMessage: "Please indicate username and password to sign up"});
    return;
  }
  User.findOne({'username': username})
    .then(foundUser =>{
      if(foundUser !== null){
        res.render('auth/signup', {errorMessage: "That username already exists. Please try again"})
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt)
      User.create({
        username: username,
        password: hashPass
      })
        .then(userCreated =>{
          console.log('user was created: ', userCreated)
          res.redirect('/')
        })
        .catch(err => console.log('Error while creating the user'))
    })
    .catch(err => console.log('Error while searching for the user in DB: ', err))
  } else {
    res.render('auth/signup', {
      errorMessage: 'Wrong Captcha'
    })
  }
})

//Iteration 2 - Login
router.get('/login', (req, res, next) =>{
  res.render('auth/login')
})

//Post request ====> http://localhost:3000/login
router.post('/login', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password
  if( username == ""|| password == ""){
    res.render('auth/login', { errorMessage: "Please indicate username and password to sign in"});
    return;
  }
  User.findOne({"username": username} )
    .then(user =>{
      if (!user){
        res.render('auth/login', { errorMessage: "The user doesn't exist"})
        return;
      }
      if(bcrypt.compareSync(password, user.password)){
        req.session.currentUser = user;
        res.render('home', {user});
      }else{
        res.render('auth/login', {errorMessage: 'Incorrect password!'});
      }
    })
    .catch(err => console.log('Error while searching for the user in DB: ', err))
})

//logout route
router.get('/logout', (req, res, next) =>{
  req.session.destroy((err) =>{
    res.redirect('/login')
  })
})

module.exports = router;