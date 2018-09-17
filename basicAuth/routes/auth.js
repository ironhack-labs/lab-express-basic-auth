const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const User = require('../models/User')
const siteRoutes = express.Router()

//Signup routes

router.get('/signup', (req, res, next)=>{
  res.render('auth/signup')
})

router.post('/signup', (req, res, next)=>{
  const {password, password2, username} = req.body
  
  if(password!==password2)return res.render('auth/signup',{error:'Tu password no coincide'})
  if(zxcvbn(password).score<=1) return res.render('auth/signup',zxcvbn(password).feedback)

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password,salt)
  
  User.create({username:username,password:hash})
    .then(user=>{
      res.send(user)
    }).catch(e=>{
      res.render('auth/signup',{error:e,userinput:req.body})
      next(e)
    })
})

// Login Routes

router.get('/login',(req,res,next)=>{
  res.render('auth/login')
})

router.post ('/login',(req,res,next)=>{
  const {username,password} = req.body
  User.findOne({username:username})
  .then (user =>{
      if(!user)return res.render('auth/login',{error:"Este ususario no existe"})
      if(bcrypt.compareSync(password,user.password)){
          req.session.currentUser = user
          res.redirect("/pages")
      } else {
          res.render('auth/login',{error:"No es tu prefil"})
      }
  })
})



// Pages route

router.get('/pages',(req,res,next)=>{
  res.render('auth/pages')
})

// Main route

router.get('/main',(req,res,next)=>{
  res.render('auth/main')
})

// Private route

router.get('/private',(req,res,next)=>{
  res.render('auth/private')
})


module.exports = router
