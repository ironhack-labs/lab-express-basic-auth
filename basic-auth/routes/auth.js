'use strict'

const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt     = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  console.log('hola')
  res.render('auth/signup');
});

router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body)

  if(!username || !password){
    console.log("rellena todo los campos");
    return res.redirect('/auth/signup');
  }
  User.findOne({username})
   .then((user)=>{
      if (user){
        res.redirect('/auth/signup');          
      }else {
        const salt  = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        User.create({username, password:hashedPassword})
          .then(()=>{
            console.log("creado");
            res.redirect("/")
          })
          .catch(next)
      } 
    })
    .catch(next)
})
module.exports = router;