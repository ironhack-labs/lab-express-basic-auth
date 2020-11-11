const { Router } = require('express');
const router = new Router();

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
 
// .get() route ==> to display the signup form to users
router.get('/signup', (req,res) =>  res.render("./auth/signup"))
 
// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
    const {Username, Password,email} = req.body
      if (!Username || !Password || !email){
      res.render("./auth/signup", {
          Username,
          Password,
          email,
          errorMessage: "All fields are mandatory. Please provide your username, email and password.",
      })
      return;
      }    

  const emailFormatRegex = /^\S+@\S+\.\S+$/;
      
  if (!emailFormatRegex.test(email)) {
    console.log("enteer");
    res.render("auth/signup", {
      email,
      Username,
      errorMessage: "Please use a valid email address.",
    });
    return;
  }



bcryptjs
    .genSalt(saltRounds)
    .then(salt => 
      bcryptjs.hash(Password,salt))
    .then((hashedPassword) =>
      User.create({ username, email, Password: hashedPassword })
        .then((newUser) => {
          console.log(newUser);
          res.redirect("/user-profile");
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render("auth/signup", {
              email,
              Username,
              validationError: error.message,
            });
          } else if (error.code === 11000) {
            res.status(500).render("auth/signup", {
              email,
              Username,
              errorMessage:
                "Username and email need to be unique. Either username or email is already used.",
            });
          } else {
            next(error);
          }
        })
    )
    .catch((err) => next(err));
  });   
    
    /* bcryptjs
    .genSalt(saltRounds)
    .then(salt => 
         bcryptjs.hash(Password,salt))
      .then(hashedPassword => {
        return User.create({
            Username,
            Password : hashedPassword,
            email
        })
        .then(userFromDB => {
          res.redirect("/userprofile")
        })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }  
     
    })
  }) */

  



  router.get('/userProfile', (req, res) => res.render('users/user-profile'));

  router.get('/login', (req, res) => res.render('auth/login'));

  router.post('login', (req,res,next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  });

module.exports = router;