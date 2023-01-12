const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

router.get('/signup', (req,res)=>{
    res.render('auth/signup')
})

router.post('/signup', (req,res)=>{
    const {email, password} = req.body

    bcrypt
    .genSalt(saltRounds)
    .then((salt)=>{
        return bcrypt.hash(password, salt)
    })
    .then((hashedPassword)=>{
         User.create({email:email, password:hashedPassword})
    })
    .then((result)=>{
        console.log(result)
        res.redirect('/signup')
    })
    .catch(err=>console.log(err))

})


module.exports = router