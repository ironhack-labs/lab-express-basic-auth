const { Router } = require('express')
const router = new Router()

const User = require('../models/User.model')
const bcryptjs = require('bcryptjs')
const saltRounds = 10;

router.get('/signup', (_, res) => res.render('user/signup'))

router.post('/signup', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const salt = await bcryptjs.genSalt(saltRounds)
        const hashedPassword = await bcryptjs.hash(password, salt)

        await User.create({ username, hashedPassword })
        res.redirect('./login')
    } catch (error) {
        next(error)
    }
})

router.get('/profile', (_, res) => res.render('user/profile'))

module.exports = router