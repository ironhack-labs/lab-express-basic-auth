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
    console.log(newUser)
    res.redirect("/")  
})


module.exports = router