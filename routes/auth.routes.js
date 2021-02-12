const mongoose = require('mongoose');
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

    if(!username || !email || !password) {
        res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please provide your username, email and password.'});
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if(!regex.test(password)) {
        res.status(500).render('auth/signup', {errorMessage: 'Password needs to have at least six chars and must contain at least one number, one lowercase and one uppercase letter.'});
        return;
    }
    
    try {
        const saltResult = await bcryptjs.genSalt(saltRounds)
        const passwordHash = await bcryptjs.hashSync(password, saltResult)
        console.log(passwordHash)

        await User.create({
            username, email, passwordHash
        })
        
        await res.redirect('/userProfile')
    
    } catch(error) {
        if(error.instanceof.mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', {errorMessage: 'Email is in the wrong format.'})
        } else if(error.code === 11000) {
            res.status(500).render('auth/signup', {errorMessage: 'Username and email need to be unique. Either username or password is already used'});
        } else {
            next(error);
        }
    }

})

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', {userInSession: req.session.currentUser});
});

router.get('/login', (req, res, next) => {
    res.render('auth/login')
});

router.post('/login', async (req, res, next) => {
    console.log('SESSION ===> ', req.session);
    const {email, password} = req.body;

    if(email === '' || password === '') {
        res.render('auth/login', {errorMessage: 'Please enter both, email and password to login.'})
        return;
    }

    try {
        const user = await User.findOne({email});
        if(!user) {
            res.render('auth/login', {errorMessage: 'Email is not registered. Try with other email'})
            return;
        } else if(bcryptjs.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user;
            res.redirect('/userProfile')
        } else {
            res.render('auth/login', {errorMessage: 'Incorrect password.'});
        }

    } catch(error) {
        next(error);
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });


module.exports = router;