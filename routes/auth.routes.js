const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRound = 10

const User = require('../models/User.model.js')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
    const {username, email, password} = req.body
    const saltGen = await bcrypt.genSalt(saltRound)
    const passHashed = await bcrypt.hash(password, saltGen)
    await User.create(
        {
           username: username,
           email: email,
           passwordHash: passHashed 

        }
    )
    await res.redirect('/user-profile')
})

router.get('/user-profile', (req, res, next) => {
    res.render('/user-profile')
})

module.exports = router