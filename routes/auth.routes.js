const express = require('express');
const router = express.Router();
const bcryptjs = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');
const secure = require('../middlewares/secure.middleware')

router.get('/signup', secure.isNotAuthenticated, (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', secure.isNotAuthenticated, (req, res, next) => {

    const {username, email, password} = req.body   

    if(!username || !email || !password){
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if(!regex.test(password)){
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(password, salt))
        .then((hashedPassword) => {
            return User.create({
                username,
                email,
                password: hashedPassword
            })
            .then((userFromDB) => {
                console.log('Newly created user is: ', userFromDB);
                res.redirect('/');
            }) 
        }) 
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                });
            } else {
                next(error);
            }
        });
})

router.get('/login', secure.isNotAuthenticated, (req, res, next) => {
    res.render('auth/login')
})

// .post() login route ==> to process form data
router.post('/login', secure.isNotAuthenticated, (req, res, next) => {
    const { email, password } = req.body
    
    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login.',
        });
        return;
    }
    
    User.findOne({ email })
    .then((user) => {
        if (!user) {
            res.render('auth/login', { errorMessage: 'Email or Password incorrect.' });
            return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            // res.render('users/user-profile', { user });
            req.session.currentUserId = user.id
            res.redirect('/profile')
            
        } else {
            res.render('auth/login', { errorMessage: 'Email or Password incorrect.' });
        }
    })
    .catch((error) => next(error));
});

router.get('/profile', secure.isAuthenticated, (req, res, next) => {
    res.render('users/user-profile')
})

router.post('/logout', secure.isAuthenticated, (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router