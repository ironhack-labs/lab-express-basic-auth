const express = require('express');
const router = express.Router();
const User = require('./../models/user-model');

//Bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.post('/signup', (req,res,next) => {
  
  const {username,password} = req.body;
  if (username === '' || password ==='') {
    res.render('./signup', {errorMessage:"Username or password cannot be empty."});
    return;  
  }
  User.findOne({username})
    .then((usernameFromDB) => {
      if (usernameFromDB) {
        res.render('./signup', {errorMessage:"Username already exist, please use a different name"});
        return;
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password,salt);
      User.create({username, password: hashedPassword})
        .then(()=>res.redirect('/'))
        .catch(()=>res.render('./signup', {errorMessage:"An error has ocurred while creating the user"}));
    })
    .catch((err) => console.error(err));
});


router.post('/login', (req,res,next) => {
  const { username, password: enteredPassword } = req.body;
  if (username === '' || enteredPassword ==='') {
    res.render('./login', {errorMessage:"Username or password cannot be empty."});
    return;  
  }
    // Find the user by username
    User.findOne({username})
      .then(usernameFromDB => {
        if (!usernameFromDB) {
          res.render('./login',{errorMessage:"User or password incorrect"});
          return;
        }
        //check password

        const passwordCorrect = bcrypt.compareSync(usernameFromDB.password,enteredPassword);
        
        console.log(passwordCorrect);
        
        if (passwordCorrect) {
          console.log('here');  
          req.session.currentUser = usernameFromDB;
          res.redirect('/');
        }else {
          res.render('./login',{errorMessage:"User or password incorrect"});
          return;
        }
      })
      .catch(err => console.error(err));
});

module.exports = router;