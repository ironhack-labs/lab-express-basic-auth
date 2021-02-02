const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
// model
const User = require("../models/User.model.js")
const mongoose = require("mongoose");




        ///// SIGNUP //////

router.get('/auth/signup', (req, res, next)=> res.render('auth/signup'));

const saltRounds =  10

router.post('/signup', (req, res, next)=> {
  //console.log(req.body)
  const {username, inputPassword} = req.body

 if(!username || !inputPassword){
   res.render("auth/signup.hbs", {
     errorMessage: "All fields are mandatory. Please provide username and password"
   });
   return;
 }
 
 const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
 if(!regex.test(inputPassword)){
   res.render("auth/signup.hbs", {
     errorMessage: "Password must be at least 6 characters long, with at least 1 number, 1 lowercase and 1 uppercase letter"
   });
   return;
 }

  bcryptjs.genSalt(saltRounds)
    .then(salt => bcryptjs.hash(inputPassword, salt))
    .then(hashedPassword => {
      return User.create({username, password: hashedPassword})
    }).then(newUserDb => {
      console.log(newUserDb)
      
      res.redirect("/login")
    })
    .catch(err => {
      if(err.code === 11000){
        res.render("auth/signup.hbs", {
        errorMessage: 'Username is already taken. Please select a different Username'});
      } else {console.log("error creating user for db: ", err)}
  })
});



        ///// LOGIN //////

router.get('/login', (req, res, next)=> res.render('auth/login'));



router.post('/login', (req, res, next)=> {
  //console.log(req.body)
  const {username, inputPassword} = req.body

  if(!username || !inputPassword){
    res.render("auth/login.hbs", {
      errorMessage: "Please enter both username and password"
    });
    return;
  }


  User.findOne({username})
    .then(userInfoDb => {
      if(!userInfoDb){
        res.render("auth/login", { errorMessage: "User not found. Please try again or register with signup"
        });
        return;
      } else if (bcryptjs.compareSync(inputPassword, userInfoDb.password )) {
        //console.log(req.session)
        req.session.currentUser = userInfoDb
        
        res.redirect("/profile")
      } else {
        res.render("auth/login", { errorMessage: "Incorrect Password"});
      }
    })
    .catch(err => console.log("error logging in user from db: ", err))
});



router.get("/profile", (req,res,next) => {
  res.render('users/profile.hbs', {userInSession: req.session.currentUser})
});








module.exports = router;