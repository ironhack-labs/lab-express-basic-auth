//IMPORTACIONES
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/User.model.js')
const saltRounds = 10

//

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', async(req, res) => {
    const { username, email, password } = req.body
   //console.log(password)
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    ///validaciones de informacion en formularios
    if (!username || !email || !password) {
        res.render('auth/signup',{errorMessage:"All the information is required"})
        return;
    }

     if (!regex.test(password)) {
        res.status(500).render('auth/signup', {
            errorMessage:"The password must contain at least 6 characters, 1 number, 1 lowercase and 1 uppercase"
        })
    }
    //validaciones con BD
try{
    const genSaltResults = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, genSaltResults)
    //console.log(genSaltResults)

    const newUser = await User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword
    })
    //console.log('Nuevo ususario creado ',newUser)
    
    res.redirect('/user-profile')
}catch(error) {
    ///validacion de correo
    if(error instanceof mongoose.Error.ValidationError){
        //aqui validamos el formato del correp
        res.status(500).render('auth/signup', {errorMessage:'The email mus be in a email format <...>@mail.com'})
    } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {errorMessage:'The user all ready exist'})
    } else {
        next(error)
    }
    //console.log(error)
}
})

///LOGIN DE USUSRIOS
router.get('/login', (req,res,next) =>{
    res.render('auth/login');
})

router.post('/login', async(req, res,next)=>{
    const {email,password} =req.body
    //console.log('Session =====> ', req.session)

    //validando inputs vacios
    if(email === "" || password === "") {
        res.render('auth/login', {errorMessage:"Please fill all the login information"})
    };

    //buscar en la BD que el usuario ya este registrado
    try{
    const newLoginUser = await User.findOne({email})
    //console.log(newLoginUser):/
    if(!newLoginUser) {
        res.render('auth/login',{errorMessage: "The user was not found, please check your information"})
        return;
    } else if (bcrypt.compareSync(password,newLoginUser.passwordHash)) {
        req.session.username= newLoginUser
        //req.session.currentUser = newLoginUser;
        //res.redirect('/user-profile',)
        console.log(req.session.username = newLoginUser)
        res.redirect('/userprofile', {val: req.session.username})
    } else {
        res.render('auth/login', {errorMessage:'Password incorrecto'})
    }

    } catch (error) {
        //console.log(error)
        next(error)
    }
});


//ACCIONAMIENTO LOGOUT
router.post('/logout', (req,res,next)=>{
    req.session.destroy()
    res.redirect('/')
})

//USER PROFILE4S
router.get('/user-profile', (req, res) => {
    const loginuser = req.session.username
    const user = req.session
    console.log(loginuser)
    console.log(user)
    res.render('user/userprofile', {
        valueCookie:loginuser, 
        userCookie:user
    })
    
});
module.exports = router 

