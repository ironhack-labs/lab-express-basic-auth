const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const checkLogin = require('../middleware/checkLogin')




router.get('/signup',(req,res,next)=>{
    res.render('signup')
})

router.post('/signup',(req,res,next)=>{
    const {username,password} = req.body

    bcrypt.hash(password,10)
    .then(hashedPassword=>{
        return User.create({
            username,
            password: hashedPassword
        })
    })
    .then(()=>{
        res.send('user created')
    })
    .catch(e =>{
        next(e)
    })
})

router.get('/login',(req,res,next)=>{
    res.render('login')
})

router.post('/login',(req,res,next)=>{
    const {username,password} = req.body
    
    if(!username || !password){
        res.render('login',{errorMessage:'Please enter both username and password'})
    }

    let currentUser

    User.findOne ({username})
      .then(user=>{
          if(user) {
              currentUser = user
              return bcrypt.compare(password,user.password)
          }
      })
      .then(hashMashed=>{
          if(!hashMashed){
              return res.send('Password is incorrect')
          }
          req.session.user = currentUser
          res.send('Password is correct')
      })
      .catch(e=>{
          next(e)
      })
})

router.get('/main',checkLogin,(req,res,next)=>{
    res.render('main')
})

router.get('/private',checkLogin,(req,res,next)=>{
    res.render('private')
})


module.exports = router