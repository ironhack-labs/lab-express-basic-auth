const express = require('express')
const bcrypt = require("bcrypt")
const router = express.Router()
const saltRounds = 10

const User = require('../models/user')

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.post('/signup', (req, res, next) => {
  const {user, password } = req.body;
  console.log(user + password);
  
  if (!user || !password) { //without user or pwrd
    req.flash('error', 'Username and Password are required')
    res.redirect('/auth/signup')
  } else {
    User.findOne({user})
    .then(user=>{
      if(user){
      req.flash('error', 'Username exist')
      res.redirect('/auth/signup')
    }else{
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      User.create({user, password: hashedPassword })
      .then(newUser => {
        res.redirect('/auth/login')
      })
      .catch(error => {
        next(error);
      })
    }
  })
    .catch(error=>{
      next(error)}
    )
  }
})


router.post('/logout', (req, res, next) => {
  delete req.session.currentUser
  res.redirect('/');
})

module.exports = router;