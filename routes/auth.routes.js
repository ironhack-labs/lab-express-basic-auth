const express= require('express')
const router= express.Router()
const bcryptjs= require('bcryptjs')
const saltRounds= 10;
const UserSchema= require('../models/User.model')

router.get('/signup', (req, res, next) => {
    res.render("auth/signup")
})

router.post('/signup', (req, res, next) => { 
//console.log(req.body)
const {username, password} = req.body

bcryptjs.genSalt(saltRounds)
.then((salt)=>{
    bcryptjs.hash(password, salt)
    .then((hashedPassword) => {
        //console.log(`Password hash: ${hashedPassword}`)
        return UserSchema.create({username, passwordHash: hashedPassword})
    })
    .then((userFromDB) => {
        console.log("Newly created user is:", userFromDB)
    })
    .catch((error) => {
        next(error)
    });
})
})






module.exports= router;