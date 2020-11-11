const { Router } = require('express');
const router = new Router();

const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
 
// .get() route ==> to display the signup form to users
router.get('/signup', (req,res) =>  res.render("./auth/signup"))
 
// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
    const {Username, Password,email} = req.body

    bcryptjs
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
                res.status(500).render('auth/signup', 
                email,
                username,
                
            } else {
                next(error);
            }
          });   
    }) 

    if (!Username || !Password || !email){
        res.render("./auth/signup", {
            Username,
            Password,
            email,
            errorMessage: "All fields are mandatory. Please provide your username, email and password.",
        })
        return;
    }

  });

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
  })

module.exports = router;