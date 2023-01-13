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

router.get('/login', (_, res) => res.render('user/login'))

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const [user] = await User.find({ username })
        if (bcryptjs.compareSync(password, user.hashedPassword)) {
            req.session.currentUser = user
            res.redirect('./profile')
        } else {
            throw Error('Username or password invalid')
        }
    } catch (error) {
        next(error)
    }
})

router.get('/profile', (req, res) => {
    const user = req.session.currentUser
    if (!user) res.redirect('./login')
    res.render('user/profile', req.session.currentUser)
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router