const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { isLoggedOut, isLoggedIn} = require('../middleware/route-guard');

// Signup

router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res, next) => {
    try {
        let {username, password} = req.body;

        if(!username || !password) {
            res.render('signup', {errorMessage: 'Please input all the fields'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({username, password: hashedPassword});

        res.redirect('/login');

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.render('signup', {errorMssage: error.message});
        } else if (error.code === 11000) {
            res.render('signup', {errorMssage: 'Email already registered'});
        }
        console.log(error);
        next(error);
    }
})


// login

router.get('/login', isLoggedOut, (req, res) => res.render('login'));

router.post('/login', async (req, res, next) => {
    try {
        let {username, password} = req.body;

        if(!password || !username) {
            res.render('login', {errorMessage: 'Please input all the fields'});
        }

        // email exists?
        let user = await User.findOne({username});

        if(!user) {
            res.render('login', {errorMessage: 'Username not found'})
        } else if (bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.redirect('/profile');
        } else {
            res.render('login', {errorMessage: 'Wrong credentials'});
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// profile

router.get('/profile', isLoggedIn, (req, res) => {
    let user = req.session.user;
    res.render('profile', user); 
}); 

// main

router.get('/main', (req, res) => {
    let user = req.session.user;

    if(user) res.render('main', user)
    else res.redirect('/')
})

// private

router.get('/private', (req, res) => {
    let user = req.session.user;

    if(user) res.render('private', user)
    else res.redirect('/')
})

// logout
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if(err) next(err)
        else res.redirect('/')
    })
})

module.exports = router;
