const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');

router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

router.post('/signup', async (req, res, next) => {
    const {username, email, password} = req.body

    const saltResult = await bcryptjs.genSalt(saltRounds)
    const hashedPassword = await bcryptjs.hashSync(password, saltResult)
    console.log(hashedPassword)

    await User.create({
        username, email, passwordHash: hashedPassword
    })
    await res.redirect('/user-profile')
})

router.get('/user-profile', (req, res) => {
    res.render('users/user-profile')
})




module.exports = router;