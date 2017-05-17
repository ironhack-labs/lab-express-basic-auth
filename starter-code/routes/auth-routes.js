const express = require('express');

const bcrypt = require('bcrypt');

const User = require("../models/users.js");

const router = express.Router();

router.get("/signup", (req, res, next)=>{
  res.render("auth/signup-views.ejs");
});

router.post('/signup', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;
//logic
  if(username ==='' || password===''){
    res.render("auth/signup-views.ejs", {
    errorMessage: "Hey! Please fill out both!"
    });
    return;
  }

  User.findOne({username: username} , {username: 1}, (err, result) =>{
  if(err) {
    next(err);
    return;
  }
  if(result !== null){
    res.render("auth/signup-views.ejs", {
    errorMessage: "Hey! Please choose another username!"
    });
    return;
    }
    const salt=bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const userInfo ={
      username: username,
      password: hashPass
    };
    const theUser = new User(userInfo);

    theUser.save((err)=>{
      if(err){
        res.render("auth/signup-views.ejs", {
        errorMessage: "Error in saving info, please try again."
        });
        return;
          }
          res.redirect('/');
        });
      });
  });

router.get('/login', (req, res, next) =>{
  res.render('auth/login-views');
});

router.post('/login', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;

  if(username === '' || password ==='') {
    res.render('auth/login-view.ejs',{
    errorMessage: "Please add information, form is blank"
  });
  return;
  }

  User.findOne({username: username}, (err, user) =>{
    if(err) {
      next(err);
      return;
    }
    if (!user){
      res.render('auth/login-view.ejs', {
        errorMessage: "Please use your user name or sign up for new account"
      });
      return;
    }

    if(bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('auth/login-view.ejs', {
        errorMessage: "Password is incorrect"
      });
      return;
    }
  });
});

module.exports = router;
