const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const User = require('../models/User')

router.get('/signup',(req,res,next)=>{
  res.render('auth/signup')
})

router.post('/signup',(req,res,next)=>{
  const {password,username} = req.body
  if(password=="" || username=="") return res.render('auth/signup',{error:'No puedes dejar campos vacios prro'})
 // if(zxcvbn(password.score<=1)) return res.render('auth/signup',{error:'POn una contraseña mas fuerte'})
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password,salt)
  
  User.create({username,password:hash})
  .then(user=>{
    // res.send(user)
    res.redirect('/login')
  })
  .catch(e=>{
    next(e)
  })
})

router.get('/login',(req,res,next)=>{
  res.render('auth/login')
})



router.post('/login',(req,res,next)=>{
  const {password,username} = req.body
  if(password=="" || username=="") return res.render('auth/signup',{error:'No puedes dejar campos vacios prro'})

  User.findOne({username:username})
  .then(user=>{
    if (!user)return res.render('auth/login',{error:'Usuario incorrecto'})
    if (bcrypt.compareSync(password,user.password)){
      req.session.currentUser = user
      res.redirect('/profile')
     // res.render('auth/profile',user)
    }else{
      res.render('auth/login',{error:'Contraseña Incorrecta'})
    }
  })
  .catch(e=>{
    next(e)
  })
})

router.get('/profile',(req,res,next)=>{
  const user = req.session.currentUser
 // res.send(user)
 console.log('lalala')
  res.render('auth/profile',user )
})


module.exports = router