const router = require('express').Router()

const User = require('../models/User.model')

const bcryptjs = require('bcryptjs')

const mongoose = require('mongoose')

//GET

router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})


//POST
router.post('/signup', async(req,res)=>{
    const {email,username,password} = req.body
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;


    if(!username,!email,!password){
        res.render('auth/signup',{errorMessage:'Por favor, rellena todos los campos.'})
        return
    }
    if(!regex.test(password)){
        res.status(500)
        .render('auth/signup',{errorMessage:'El password no es seguro. Debe contener al menos 5 caracteres, un número, una minúscula y una mayúscula'})
        return
      }

    try{
        const salt = bcryptjs.genSaltSync(10)
        const hashedPass = bcryptjs.hashSync(password,salt)
        const user = await User.create({email,username,password:hashedPass})
        res.redirect(`/profile/${user._id}`)
    } catch(error){
        console.log("ERROR EN POST USER",error)
        if(error instanceof mongoose.Error.ValidationError){
            res.status(500).render('auth/signup',{errorMessage:error.message})
        }else if (error.code === 11000){
            res.status(500).render('auth/signup',{errorMessage: 'El usuario o la contraseña ya existen. Selecciona uno diferente por favor.'})
        } else {
            next(error)
        }
   }
})


////////////////////GET PROFILE URL WHEN SIGN UP///////////////////
router.get('/profile/:id',(req,res)=>{
    User.findById(req.params.id)
    .then(user=>{
        res.render('auth/profile',{user})
    })
    .catch(error=>{
        console.log("ERROR EN GET PROFILE",error)
        res.render("ERROR")
    })
})

//////////LOGIN//////////
router.get('/userProfile',(req,res)=>{
    res.render('users/user-profile')
})

router.get('/login',(req,res,next)=>{
    res.render('auth/login',{userInSession: req.session.currentUser})
})

router.post('/login',(req,res,next)=>{
    const{email,password} = req.body;
    if(email === '' || password === ''){
        res.render('auth/login',{errorMessage:'Por favor, ingresa tu email y password para acceder'})
        return;
    }

    User.findOne({email})
    .then(user=>{
        if(!user){
            res.render('auth/login',{errorMessage: 'El email no esta registrado. Ingresa un email válido.'})
            return
        } else if (bcryptjs.compareSync(password,user.password)){
            req.session.currentUser = user;
            res.redirect('/userProfile')
            //res.render('users/user-profile')
        } else {
            res.render('auth/login',{errorMessage: 'Incorrect password.'})
        }
    })
    .catch(error => {
        next(error)
    })
})

module.exports = router;
