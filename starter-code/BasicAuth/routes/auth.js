const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const zxcvbn = require('zxcvbn')

const User = require('../models/User')

router.get('/', (req,res,next)=>{
  res.render('home')
})


router.get('/signup', (req,res,next)=>{
  res.render('auth/signup')
})


router.post('/signup', (req,res,next)=>{
  const {password, username} = req.body
  if(zxcvbn(password).score<=1) return res.render('auth/signup', zxcvbn(password).feedback)
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password,salt)
  User.create({username, password:hash})
  .then(user=>{
    res.redirect('/login')
  })
  .catch(e=>{
    console.log('error',e)
    next(e)
  })
})

router.get('/login', (req,res,next)=>{
  res.render('auth/login')
})

router.post('/login', (req,res,next)=>{
  const {username, password} = req.body
  User.findOne({username:username})
  .then(user =>{
    if(!user) return res.render('auth/login', {error: 'nememes'})
    if(bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user
    }else{
      res.render('auth/login',{error: "no es tu contra"})
    }
  })
})

module.exports = router

 