const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require("bcrypt")

const User = require("../models/User.model.js")
const router = express.Router()
const saltRounds = 10



router.get("/signup" ,(req,res,next)=>{
    res.render("auth/signup")
})

router.post("/signup" , async (req,res,next)=>{
    const { username , passwordHash} = req.body
    if(!passwordHash||!username){
        res.render("auth/signup", {errorMessage : "Todos los campos son necesarios"})
        return 
    }  
        const passRound = await bcrypt.genSalt(saltRounds)
        const passCrypt = await bcrypt.hash(passwordHash, passRound)
        const newUser = await User.create({username , passwordHash:passCrypt})
        res.redirect("/")  
    
})

router.get("/login", (req,res,next)=>{
    res.render("auth/login")
})

router.post("/login", async (req,res,next)=>{
    const { username, passwordHash } = req.body
    if(username === "" || passwordHash === ""){res.render('auth/login', {errorMessage: "Por favor, ingresa ambos campos. No dejes vacío ninguno."})}
    const userDB = await User.findOne({username})
    if(!userDB){
        res.render("auth/login",{errorMessage: "Este usuario no existe"})
    }
    const match = await bcrypt.compareSync(passwordHash , userDB.passwordHash)
    if(match){
        req.session.currentUser = userDB 
        console.log("ESTO ME IMPRIME LA COOKIE ====>", req.session.currentUser , req.session.sessioncookie)
        res.render("user/userProfile" , {userDB})
    }else{
        res.render("auth/login",{ errorMessage : "Contrasña incorrecta"})
    }

})

router.get("/user-profile" ,(req,res,next)=>{
    const sesion = req.session
    console.log(sesion)
    res.render("user/user-profile" , {userInSession : req.session} )
})

router.get("/userProfile" , (req,res)=>{
    // console.log("esto es lo que imprime" , req.session)
    res.render("user/userProfile" , {userInSession : req.session})
})

// router.get("/logout" , (req,res)=>{
//     
// })

module.exports = router

