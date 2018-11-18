const express     = require('express');
const router      = express.Router();
const mongoose    = require('mongoose')
const User        = require('../models/user')
const bcrypt      = require("bcrypt");
const bcryptSalt  = 10;


/* GET home page */
router.get('/', (req, res, next) => {
    res.render('signup');
});

router.get('/success', (req, res, next) => {
  res.render('signupsuccess');
});

router.post('/', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  if (req.body.username === "" || req.body.password === "") {
   
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
  } else {
    User.findOne({ "username": username })
      .then(user => {
        if (user !== null) {
          res.render("signup", {
            errorMessage: "The username already exists"
          });
        } else {
          const newUser = User({
            username,
            password: hashPass
          })
          newUser.save()
            .then(user => {
              res.redirect('/signup/success')
            })
    
        }
      }) 
    }
  })


module.exports = router;
