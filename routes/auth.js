const express = require('express');
const router  = express.Router();

const bcrypt     = require("bcrypt");
const User = require('../models/User.model');
const saltRounds = 10; 
const salt  = bcrypt.genSaltSync(saltRounds);


//redirecciono
router.get('/signup', (req, res, next) => {
  res.render('auth/signUp');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});


//hago la llamada a la base de datos una vez el usuario se ha intentado autentificar
router.post("/signup", (req, res, next)=>{
  const userName=req.body.username;
  const password= req.body.password;
  if(userName===""|| password===""){
    res.render('auth/signUp',{errorMessage: "the user or the password are empty!"});
    return;
  }    
  User.findOne({"username":userName}).then(user=>{
    if(user!== null){
      res.render('auth/signUp',{errorMessage: "the user already exists"});
      return;
    }
    const hashPassword = bcrypt.hashSync(password, salt);
    User.create({
      "username": userName,
      "password": hashPassword
    }).then(ele=>{
      res.redirect("/");
    });
  })  
})
router.post("/login", (req, res, next)=>{
  const userName=req.body.username;
  const password= req.body.password;
  if(userName===""|| password===""){
    res.render('auth/login',{errorMessage: "the user or the password are empty!"});
    return;
  }
  User.findOne({"username":userName}).then(user=>{
    if(user===null){
      res.render('auth/login',{errorMessage: "the user doesn't exist!"});
    return;
    }
    if(bcrypt.compareSync(password,user.password)){
      req.session.currentUser=user;
      res.redirect ("/");
    }
    else{
      res.render('auth/login',{errorMessage: "the password is not correct!"});
    }

  })
  .catch(error => {
    next(error);
  })
})
module.exports = router;
