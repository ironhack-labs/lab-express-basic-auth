const router = require('express').Router()
const bcrypt = require('bcryptjs')

//MODELS
const User = require('../models/User.model.js')


//ROUTES
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

module.exports = router