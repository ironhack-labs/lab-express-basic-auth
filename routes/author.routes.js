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


//GET PROFILE URL
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

module.exports = router;
