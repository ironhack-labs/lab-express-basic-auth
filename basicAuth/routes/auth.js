const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const User = require('../models/User')

//signup
router.get('/signup',(req,res,next)=>{
  res.render('auth/signup')
})
router.post('/signup',(req,res,next)=>{
  const {username,password,password2} = req.body
  if(password !== password2) return res.render('auth/signup', {error:'la contraseña no coincide'})
  if(zxcvbn(password).score<=1) return res.render('auth/signup', zxcvbn(password).feedback)

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password,salt)

  User.create({username,password:hash})
  .then(user=>{
    res.send(user)
  }).catch(e=>{
    console.log(e)
    res.render('auth/signup', {error:e, userinput:req.body})
    next(e)
  })
})

//login

router.get('/login',(req,res,next)=>{
  res.render('auth/login')
})

router.post('/login',(req,res,next)=>{
  const {username,password} = req.body
  User.findOne({username})
  .then(user=>{
    if(!user) return res.render('auth/login', {error:'User do not exist, enter username or password again'})
    if(bcrypt.compareSync(password, user.password)){
      req.session.currentuser = user
      res.redirect(`/profile/${user._id}`)
    }
  })
})

//profile
router.get('/profile/:id',(req,res,next)=>{
  const {id} = req.params
  User.findById(id)
  .then(user=>{
    res.render('auth/profile',user)
  }) 
})


module.exports = router