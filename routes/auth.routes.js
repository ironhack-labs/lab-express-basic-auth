const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcryptjs');
const baseModule = require('hbs');
const { request } = require('../app');
const saltRounds = 10;
const User = require('../models/User.model.js')

router
    .get('/signup', (req, res) => {
        res.render('auth/signup') //../views/auth/signupView'
    })
    .post('/signup', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const randomString = await bcrypt.genSalt(saltRounds)
            const hashedPassword = await bcrypt.hash(password, randomString)
            const newUser = await User.create({ username, email, password: hashedPassword })
            res.redirect('/')
            console.log('NEW USER:', newUser)
        } catch (err) {
            console.log('There is an error:', err)
        }
    })

module.exports = router;
