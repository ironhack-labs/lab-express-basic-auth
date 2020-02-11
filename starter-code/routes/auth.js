var express = require('express');
var authRouter = express.Router();
const User = require('./../models/User');

// 1 - Require `bcrypt` for passwords hashing
// 2 - Create variable for the number of salt rounds
const bcrypt = require('bcrypt');
const zxcvbn = require('zxcvbn');
const saltRounds = 10;

// POST '/'
authRouter.post('/', (req, res, next) => {
  // 3 - Deconstruct the `username` and `password` from req.body
  const { username, password } = req.body;

   // 4 - Check if `username` or `password` are empty and display error message
  if (password === '' || username === '') {
    res.render('auth/signup-form', {
      errorMessage: "Username and Password are required"
    });
    return;
  }

  // Check the password strength
  // if (zxcvb(password).score < 3) {
  //   res.render('auth/signup-form', {
  //     errorMessage: "Password too weak, try again"
  //   })
  // }

  // 5 - Check the users collection if the username already exists
  User.findOne({username})
    .then((user) => {
      // > if `username` already exists in the DB and display error message
      if (user) {
        console.log("WHAT IS USER", user);

        res.render('auth/signup-form', {
          errorMessage: "Username already exists"
        });
        return;
      }

      // > If `username` doesn't exist generate salts and hash the password
      
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      
      User.create({username, password:hashedPassword})
        .then(()=> res.redirect('/'))
        .catch(err => {
          res.render("auth/signup-form", {
            errorMessage: "Error while creating the new user."
          });
        });
    })
    .catch(err => console.log(err))
})



// GET    /signup
authRouter.get('/',(req,res)=>{
  res.render('auth/signup-form');
});

module.exports = authRouter;