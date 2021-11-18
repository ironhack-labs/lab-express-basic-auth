const router = require('express').Router()
const bcrypt = require('bcryptjs')


//MODELS
const User = require('../models/User.model.js')


//ROUTES
//Signup
router.get('/signup', (req, res) => {
    res.render('./signup.hbs')
})

router.post('/signup', async (req, res) => {
    const { username, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ username, password: hashedPassword })
        res.redirect('/')
    }
    catch (err) {
        console.log('Error signing up:', err)
    }
})

//Login
router.get('/login', (req, res) => {
    res.render('login.hbs')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.render('login', { errorMsg: 'You need to fill all fields' })
    }

    const userFromDB = await User.findOne({ username })
    if (!userFromDB) {
        res.render('login', { errorMsg: 'User does not exist' })
    }
    else {
        const passwordCheck = await bcrypt.compare(password, userFromDB.password)
        if (!passwordCheck) {
            res.render('login', { errorMsg: 'Incorrect password' })
        }
        else {
            req.session.loggedUser = userFromDB
            res.redirect('/')
        }
    }
})

module.exports = router