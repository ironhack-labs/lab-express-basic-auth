const express = require('express');
const router = express.Router();
const User = require('./../models/user-model');

//Bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.post('/signup', (req,res,next) => {
  
  const {username,password} = req.body;
})


module.exports = router;

// 3 - Check if the username and password are empty strings

// 4 - Check if the username already exists - if so send error



