//1. IMPORTACIONES

const express = require("express")
const router = express.Router()
const bcryptjs = require("bcryptjs")
const saltRounds = 10
const UserSchema = require('../models/User.model')

//GET, mostrar el formulario de registro

router.get("/signup",(req,res,next)=>{
    res.render("auth/signup")
})


//POST, para procesar la info del registro

router.post("/signup",(req,res,next)=>{
    //console.log('The form data:',req.body)
     const {username, password} = req.body

     bcryptjs.genSalt(saltRounds)
     .then((salt)=>{
         bcryptjs.hash(password,salt)
    .then((hashedPassword)=>{
        
        //console.log(`Password hash:${hashedPassword}`)
        return UserSchema.create({username,passwordHash:hashedPassword})
    })
    .then((userFromDB)=>{
        console.log('Newly created user is: ', userFromDB)
    })
    .catch((error)=>{
        next(error)
    })
     })

})



module.exports = router;