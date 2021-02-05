const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')

//Modelo:
 const User = require('../models/User.model')

 router.get('/auth/signup', (req, res,) => res.render('auth/signup'));

 const saltRounds =  10

 router.post('/signup', (req, res, next) => {
    const { username, inputPassword } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(inputPassword, salt))
      .then((hashedPassword) => {
        return User.create({username,password:hashedPassword})
      }).then((newUserDb) => console.log(newUserDb))
      .catch(err=> console.log('error creating use',err))
  });


  module.exports = router; 