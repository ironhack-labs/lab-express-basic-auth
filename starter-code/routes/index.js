const express = require('express');
const router  = express.Router();
const authMongoose= require ('../models/authentication');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");






/* GET home page */
router.post('/login', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password
  authMongoose
    .findOne({ username: username })
    .then((userData) => {
      const isAuthorized = bcrypt.compareSync(password, userData.password)
      if (isAuthorized) {
        req.session.currentUser = req.body.username;
        res.render("authok", userData)
      } 
    })
    .catch((err)=>{
      res.render("auth-no-ok")
    })
});
  
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/login', (req, res, next) => {
  const data = {
    action: "login"
  }
  res.render('index', data);
});

router.post('/signup', (req, res, next) => {
  let saltRounds = 1
  let salt = bcrypt.genSaltSync(saltRounds)
  let encryptedPwd = bcrypt.hashSync(req.body.password, salt)
  authMongoose
    .create({ username: req.body.username, password: encryptedPwd })
    .then((userGenerated) => {
      res.render("authok", userGenerated)
    })
});

router.get('/signup', (req, res, next) => {
  const data = {
    action: "signup"
  }
  res.render('index', data);
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect("/");
  });
});

router.use((req, res, next) => {
  console.log(req.session)
  if (req.session.currentUser) { 
   next(); 
  } else {            
   res.redirect("/login");
  }             
 });

router.get("/private", (req, res, next) => {
  res.render("private");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

module.exports = router;
