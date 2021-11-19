const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { isLoggedIn } = require('../middleware/route-guard')


//MODELS
const User = require('../models/User.model.js')


//ROUTES
//Signup
router.get('/signup', isLoggedIn, (req, res) => { //Prevent logged in user from signing up
    res.render('./signup.hbs')
})

router.post('/signup', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.render('./signup.hbs', { errorMsg: 'Please fill all fields' })
    }
    else {
        const uniqueUserCheck = User.find({ username })
        if (uniqueUserCheck) {
            res.render('./signup.hbs', { errorMsg: 'Username already in use' })
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({ username, password: hashedPassword })
            res.redirect('/')
        }
    }
})

//Login
router.get('/login', isLoggedIn, (req, res) => {
    res.render('./login.hbs')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const userFromDB = await User.findOne({ username })
    if (!userFromDB) {
        res.render('./login.hbs', { errorMsg: 'User does not exist' })
    }
    else {
        const passwordCheck = await bcrypt.compare(password, userFromDB.password)
        if (!passwordCheck) {
            res.render('./login.hbs', { errorMsg: 'Incorrect password' })
        }
        else {
            req.session.loggedUser = userFromDB
            res.redirect('/')
        }
    }
})

//Logout
router.post('/logout', async (req, res, next) => {
    res.clearCookie('connect.sid', { path: '/', })
    try {
        await req.session.destroy()
        res.redirect('/')
    }
    catch (err) {
        next(err)
    }
})

module.exports = router