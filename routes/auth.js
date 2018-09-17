const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const zxcvbn= require('zxcvbn')

router.get('/',(req,res,next)=>{
 const password = 'hola1234'
 const salt = bcrypt.genSaltSync(10)
 const hash = bcrypt.hashSync(password,salt)
 res.send(hash)
})

module.exports=router

//signup routes

router.get('/signup',(req,res,next)=>{
 res.render('auth/signup')
})

router.post('/signup',(req,res,next)=>{
 const {password,password2,username} = req.body

 console.log(zxcvbn(password))
 if(password !== password2) return res.render('auth/signup',{err:'Checa tus contraseña'})
 if(zxcvbn(password).score<=1) return res.render('auth/signup',zxcvbn(password).feedback)
 

 const salt = bcrypt.genSaltSync(10)
 const hash = bcrypt.hashSync(password,salt)
 User.create({username,password:hash})
 .then(user=>{
   res.send(user)
   console.log(req.user)
    res.redirect('/auth/main')
 })
 .catch(e=>{
   res.render('auth/signup',{error:e,userinput:req.body})
   next(e)
 })
})


//login routes

router.get('/login',(req,res,next)=>{
  res.render('auth/login')
})
router.get('/main',(req,res,next)=>{
  res.render('auth/main')
})
router.get('/private',(req,res,next)=>{
  res.render('auth/private')
})

router.post('/login',(req,res,next)=>{
  const {username, password} = req.body
  User.findOne({username:username})

  .then(user=>{

    if(!user)return res.render('auth/login',{error:'Este usuario no existe'})
    if(bcrypt.compareSync(password,user.password)){
      red.session.currentUser = user
      res.redirect('/auth/main')

    }else{
      res.render('/auth/private',{error:'Esta no es tu cuenta'})
    }
    res.send(user)
  })
})



module.exports = router