const router = require('express').Router()
const mongoose = require('mongoose')

const User = require('../models/User.model')

const bcryptjs = require('bcryptjs')
const saltRounds = 10;

router.get('/signup', (_, res) => res.render('user/signup'))

router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body
    
    if (!username || !password) {
            res.render('user/signup', {errorMessage: 'All fields are required!'})
            return;
        }

    if (password.length <= 8) {
        res.render('user/signup', {
            errorMessage: 'Password must be at least 8 characters long.'
        })
        return;
    }

        
    try {
        const salt = await bcryptjs.genSalt(saltRounds)
        const hashedPassword = await bcryptjs.hash(password, salt)
        
        await User.create({ username, hashedPassword })
        res.redirect('./login')

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('user/signup', { errorMessage: error.message })
        } else if (error.code === 11000) {
            res.status(500).render('user/signup', {
                errorMessage: 'Username already in use! Please choose a diferent username.'
            })
        } else {
            next(error)
        }
    }
})

router.get('/login', (_, res) => res.render('user/login'))

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    
    if (!username || !password) {
        res.render('user/login', {errorMessage:"Username and Password are required fields"})
        return;
    }
    
    try {
        const [user] = await User.find({ username })

        if (user && bcryptjs.compareSync(password, user.hashedPassword)) {
            req.session.currentUser = user
            res.redirect('./profile')
        } else res.render('user/login', { errorMessage: 'invalid username or password'})

    } catch (error) {
        next(error)
    }
})

router.get('/profile', (req, res) => {
    const user = req.session.currentUser
    if (!user) res.redirect('./login')
    res.render('user/profile', req.session.currentUser)
})

router.post('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) next(error)
    })
    res.redirect('/')
})

module.exports = router