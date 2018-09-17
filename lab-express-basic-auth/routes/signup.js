const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const User = require('../models/User')


router.get('/signup', (req,res,next)=>{
    res.render('auth/signup')
})

router.post('/signup', (req,res,next)=>{
    const{password,username} = req.body
    console.log(username)

    if(username === "") return res.render('auth/signup',{error:"Debe introducir un usuario"})
    if(password === "") return res.render('auth/signup',{error:"Debe introducir un password"})
    
    if(User.findOne({username:username})){
        console.log(User.findOne({username:username})) 
        return res.render('auth/signup',{error:"Ese usuario ya existe"})
    }
    const salt=bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password,salt)

    User.create({username:username, password:hash})

    .then(user=>{
        res.send(user)
    }).catch(e=>{
        res.render('auth/signup')
        next(e)
    })
})

router.get('/login',(req,res,next)=>{
    res.render('auth/login')
})

router.post('/login',(req,res,next)=>{
    const {username,password} = req.body
    
    User.findOne({
        username:username
    })
    .then(user =>{
        if(!user) return res.render('auth/login', {error: 'el usuario no existe'})
        if (bcrypt.compareSync(password,user.password)){
            req.session.currentUser = user
            res.render ('auth/main',user)
            res.render('auth/private',user)
        }else{
            res.render('auth/login',{error:'Contraseña incorrecta'})
        }
    })
})

router.use((req,res,next)=>{
    if (req.session.currentUser){
        next();
    }else{
        res.redirect('/login')
    }
})

router.get ('/main',(req,res,next)=>{
    res.render('/auth/main')
})

router.get ('/private',(req,res,next)=>{
    res.render('/auth/private')
})

module.exports = router