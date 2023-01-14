const User = require('../models/User.model');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { render } = require('../app');
const saltRounds = 5;

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
    const {username, password} = req.body
    bcrypt 
        .genSalt(saltRounds)
        .then((salt) => {
            return bcrypt.hash(password, salt)
        })
        .then(hashedPassword => {
            console.log(hashedPassword)
            User.create({
                username: username, 
                passwordHash: hashedPassword
            })
            res.redirect('/main')
        })
        .catch((error) => {
            console.log(error)
        })
})

router.get('/profile', (req, res) => {
    res.render('user-profile')
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
        res.render('private/private')
    })
    .catch ((err) => {
        console.log('The error while rendering user page is: ', err)
    })
})


module.exports = router