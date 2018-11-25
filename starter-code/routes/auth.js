const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

const saltRounds = 7

//Todas estas rutas tienen antepuesto /auth
router.get('/signup',(req, res, next)=>{
  res.render('auth/signup')
})

router.post('/signup',(req, res, next)=>{
  const {username,password1,password2} = req.body
  //fields can't be empty
  if(username === '' || password1 === '' || password2 === ''){
    return res.render('auth/signup',{
      message: "Fields can't be empty"
    })
  }
  if(password1 !== password2){
    return res.render('auth/signup',{
      message: "Passwords don't match"
    })
  }
  User.findOne({username})
    .then(response=>{
      if(response === null){
        const salt = bcrypt.genSaltSync(saltRounds)
        const password = bcrypt.hashSync(password1,salt)
        User.create({username, password})
        .then(user=>{
          res.redirect('/auth/login')
        }).catch(e=>next(e))
      } else {
        //username can't be repeated
        return res.render('auth/signup',{
          message: 'This username already exists'
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
        message: "This user doesn't exist, please sign up first"
      })
    }
    if(bcrypt.compareSync(password,user.password)){
      req.session.currentUser = user
      return res.redirect('/profile')
    } else {
      return res.render('auth/login',{
        message: "I don't know Rick, it looks fake 🤔"
      })
    }
  }).catch(e=>next(e))
})

module.exports = router