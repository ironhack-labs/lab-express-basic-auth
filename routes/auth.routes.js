const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model')

router.get('/auth/signup', (req,res)=>{
    res.render('auth/signup')
})




router.post("/auth/signup", (req,res)=>{
    const {password, email} = req.body
    const saltRounds = 12

    const salt = bcrypt.genSaltSync(saltRounds)
    const newPassword = bcrypt.hashSync(password, salt)

    const emailLowerCase = email.toLowerCase()
    req.body.email = emailLowerCase
    req.body.passwordHash = newPassword
    delete req.body.password
    console.log(req.body)
    User.create(req.body)
        .then(()=>{
            res.redirect('/accountCreated')
        }).catch(console.log)
})










module.exports = router;