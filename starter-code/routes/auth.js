const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {hashPassword, checkHashed} = require('../lib/hashing')

router.get('/signup', (req, res, next)=>{
    res.render('auth/signup', {title: 'Register'});
})

router.post('/signup', async (req, res, next) => {
    const { username, password, firstName, lastName, zipCode } = req.body;
    if(!username || !password) {
        console.log('Empty fields')
        return res.redirect('/auth/signup')
    }
    
    const existUser = await User.findOne({ username })
    if (!existUser) {
        const newUser = await User.create({
            username,
            password: hashPassword(password),
            firstName,
            lastName,
            zipCode
        });
        console.log(`User created: ${newUser}`)
        return res.redirect('/');
    } else {
        console.log('user already exists')
        return res.redirect('/auth/signup')
    }
})

router.get('/login', (req, res, next) => {
    res.render('auth/login', {title: 'Login'})
})

router.post('/login', async (req, res, next ) => {
    const {username, password} = req.body;
    const existUser = await User.findOne({username});
    console.log(existUser)

    if(!existUser || !checkHashed(password, existUser.password)){
        return res.render('auth/login', {errorMessage: "User or Password incorrect"});
    }

    console.log(`Welcome ${existUser}`);
    req.session.currentUser = existUser;
    return res.redirect("/user/main")
})

router.get('/logout', (req, res, next)=>{
    req.session.currentUser = null;
    return res.redirect('/')
})

module.exports = router;