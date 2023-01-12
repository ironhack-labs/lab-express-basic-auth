const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { application } = require('express');
const saltRounds = 10;
const User = require('../models/User.model')

router.get('/signup', (req,res,next) => {
    try {
        res.render('auth/signup')
    }
    catch(err) {
        next(err)
    }
})

router.post('/signup', async (req,res,next) => {
    try {
        const {username, password} = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        await console.log(hashedPassword);
        await User.create(
            {
                username: username,
                passwordHash: hashedPassword
            });
        await res.redirect('/signup');
        }
        catch(err){
            next(err)
        }
    })

 

module.exports = router