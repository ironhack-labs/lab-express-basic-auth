//IMPORTACIONES
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/User.model.js')
const saltRounds = 10

//

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up')
})

router.post('/sign-up', async(req, res) => {
    const { username, email, password } = req.body
    console.log(password)
    const genSaltResults = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, genSaltResults)
    console.log(genSaltResults)
    await User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword
    })
    await res.redirect('/user-profile')
})

router.get('/user-profile', (req, res) => {
    res.render('user-profile')
})
module.exports = router