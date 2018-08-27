const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const session = require('express-session')
const User = require('../models/User')

router.get('/', (req, res) => {
    res.render('sign-in')
})

router.post('/', (req, res) => {
    const { email, password } = req.body
    const encrypted = bcrypt.hashSync(password, 15)

    User.findOne({ email }).then(user => {
        if (!user) return res.send('no such user')
        const passwordMath = bcrypt.compareSync(password, user.password)

        if (!passwordMath) return res.send('wrong password')

        const cleanUser = user.toObject()
        delete cleanUser.password

        req.session.currentUser = cleanUser

        res.send('You are logged in')
    })
})

module.exports = router
