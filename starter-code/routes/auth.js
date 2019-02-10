let router = require('express').Router()
let express = require('express')
let User = require('../models/User')
let bcrypt = require('bcrypt')

// mi primer middleware! =3 🥰
function isAuth(req,res,next){
  if(req.session.currentUser){
    res.redirect('/')
  }else{
    next()
  }
}

router.post('/login', (req,res,next)=>{
  let {email, password} = req.body
  User.findOne({email})
  .then(user=>{
    if(!user) return res.render('auth/login', {error:"Tu cuenta no existe"})
    if(bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user
      res.redirect('/')
      return
    }
    res.render('auth/login', {error:"Tu contraseña está mal"})
    
  })
  .catch(e=>next(e))


})

router.get('/login', isAuth, (req,res,next)=>{
  res.render('auth/login')
})

router.post('/signup', (req,res,next)=>{
  if(req.body.password !== req.body.password2){
     res.render('auth/signup', {...req.body, errors:{password:"escribe bien tu contraseña!"}})
     return
    }
  //encriptar el password
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(req.body.password, salt)
  req.body.password = hash
  //
  User.create(req.body)
  .then(()=>res.redirect('/login'))
  .catch(e=>next(e))
})

router.get('/signup', (req,res,next)=>{
  res.render('auth/signup')
})

module.exports = router