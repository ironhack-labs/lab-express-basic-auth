const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user-model");

router.get('/home', (req, res, next) =>{
  res.render('home')
})

//Iteration 3 - Protected Routes
router.use((req, res, next) =>{
  if(req.session.currentUser) {
    next();
  }else{
    res.redirect('/home')
  }
})

router.get('/main', (req, res, next) =>{
  res.render('protected/main')
})

router.get('/private', (req, res, next) =>{
  res.render('protected/private');
})

module.exports = router;
