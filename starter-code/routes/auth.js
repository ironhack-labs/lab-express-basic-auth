const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const saltRounds = 11;

router.get('/signup',(req, res, next)=>{
  res.render('auth/signup')
})
 router.post('/signup',(req, res, next)=>{
  const {username,password,password2} = req.body
  if(username === '' || password === '' || password2 === ''){
    return res.render('auth/signup',{
      message: "Los campos no deben estar vacios"
    })
  }
  if(password !== password2){
    return res.render('auth/signup',{
      message: "Las contraseñas no son iguales"
    })
  }
  User.findOne({username})
    .then(response=>{
      if(response === null){
        const salt = bcrypt.genSaltSync(saltRounds)
        const password = bcrypt.hashSync(password,salt)
        User.create({username, password})
        .then(user=>{
          res.redirect('/auth/login')
        }).catch(e=>next(e))
      } else {
      
        return res.render('auth/signup',{
          message: 'Este nombre de usuario ya existe'
        })
      }
    }).catch(e=>next(e))

  console.log(req.body)
})
 router.get('/login',(req, res, next)=>{
  if(req.session.currentUser) return res.redirect('/profile')
  res.render('auth/login')
})
 router.post('/login',(req, res, next)=>{
  const {username, password} = req.body
  User.findOne({username})
  .then(user=>{

    if(user === null){
      return res.render('auth/login',{
        message: "El usuario no existe, Registrese por favor!"
      })
    }
    if(bcrypt.compareSync(password,user.password)){
      req.session.currentUser = user

      return res.redirect('/profile')
    } else {

      return res.render('auth/login',{
        message: "Incorrecto!"
      })
    }
  }).catch(e=>next(e))
})
 module.exports = router 