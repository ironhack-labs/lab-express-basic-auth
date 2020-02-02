const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {hashPassword, checkHashed} = require('../lib/hashing')

router.get('/signup', (req, res, next)=>{
    res.render('auth/signup');
})

router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password) {
        console.log('Empty fields')
        return res.redirect('/auth/signup')
    }
    const existUser = await User.findOne({ username })
    if (!existUser) {
        const newUser = await User.create({
            username,
            password: hashPassword(password)
        });
        console.log(`User created: ${newUser}`)
        return res.redirect('/');
    } else {
        console.log('user already exists')
        return res.redirect('/auth/signup')
    }
   
})

module.exports = router;