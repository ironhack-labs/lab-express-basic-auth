// IMPORTACIONES
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User.model.js')
const saltRounds = 10


// GET Formulario Signup
router.get('/signup',(req, res, next)=>{
    res.render('auth/signup')
})
// POST Formulario enviado al backend
router.post('/signup',async(req,res,next)=>{
    const {username, email, password} = req.body
    console.log(password)
    const saltresult = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, saltresult)
    console.log(saltresult)
    await User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword
    })
    await res.redirect('/user-profile')
})
router.get('/user-profile',(req,res)=>{
    res.render('users/user-profile')
})
// GET Perfil del usuario

module.exports = router;