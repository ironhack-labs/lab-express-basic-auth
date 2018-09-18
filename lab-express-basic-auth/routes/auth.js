const express = require('express')
const router = express.Router()
const bcrypt =require('bcrypt')
const zxcvbn = require('zxcvbn')
const User = require('../models/User')
let usuario = {}



//signup rutes

router.get('/signup', (req, res, next)=>{
  res.render('auth/signup')
})

router.get('/', (req, res ,next)=>{
  res.render('auth/login')
})

router.post('/', (req, res, next)=>{
  const {password, password2, username}= req.body


  console.log(zxcvbn(password))


  if(password!==password2) return res.render('auth/signup', {error:'No seas wey, checa tu contraseña'})
  if(zxcvbn(password).score<=1) return res.render('auth/signup', zxcvbn(password).feedback)
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  User.create({username:username, password:hash })
    .then(user=>{
      res.send(user)
    }).catch(e=>{
      res.render('auth/signup', {error:e,userinput:req.body})
      next(e)
    })
})


//login router


router.get('/login', (req, res, next)=>{
  res.render('auth/login')
})


router.post('/login', (req, res, next)=>{
  const {username, password} = req.body
  User.findOne({username:username})
    .then(user=>{
      if(!user) return res.render('auth/login', {error:'Este usuario no existe'})
      if(bcrypt.compareSync(password, user.password)){
        req.session.currentUser = user
        return res.redirect('./main')

      }
      else{
        res.render('auth/login', {error:'No seas tracala este no eres tunas '})
      }
     
    })
})



router.get('/main' , (req, res, next)=>{
  res.render('auth/main')
})






module.exports = router