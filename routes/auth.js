const User = require('../models/User.model');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { render } = require('../app');
const saltRounds = 5;
const mongoose = require('mongoose');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
    const {username, email, password} = req.body
if (!username ||!email || !password) {
    res.render('auth/signup', {errorMessage: 'Password, email and username required.'})
    return
}

const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
if(!regex.test(password)){
    res.render('auth/signup',{errorMessage: "Please input a password: at least 6 characters long, with a lowercase and uppercase letter"})
    return
}

    bcrypt 
        .genSalt(saltRounds)
        .then((salt) => {
            return bcrypt.hash(password, salt)
        })
        .then(hashedPassword => {
            console.log("Hashed password:", hashedPassword)
            return User.create({
                username: username, 
                email: email,
                passwordHash: hashedPassword
            })
        })
        .then(()=> {
            res.redirect('/profile')
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', {errorMessage: error.message});
            } else if (error.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'Username and email need to be unique and not already in use.'
                });
            } else {
                next(error);
            }
        });
})

router.get('/profile', (req, res) => {
    res.render('user/user-profile')
})

router.get('/main', (req, res) => {
    res.render('private/main')
})

router.get('/user', (req, res) => {
    User.find()
    .then((result) => {
        res.render('user-profile', {result})
    })
})

router.get('/user/:id', (req, res) => {
    User.findById(req.params.id)
    .then((result) => {
        res.render('user/user-profile')
    })
    .catch ((err) => {
        console.log('The error while rendering user page is: ', err)
    })
})


module.exports = router