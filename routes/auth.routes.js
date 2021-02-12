//IMPORTACIONES
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const User = require('../models/User.model.js')
const saltRounds = 10

//

router.get('/sign-up', (req, res, next) => {
    res.render('auth/sign-up')
})

router.post('/sign-up', async(req, res, next) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.render('auth/sign-up', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/sign-up', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
    console.log(password)
    const genSaltResults = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, genSaltResults)
    console.log(genSaltResults)
    await User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword
    }).catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/sign-up', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/sign-up', {
                errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
        } else {
            next(error);
        }
    })
    res.redirect('/login')

})

router.get('/user-profile', (req, res) => {
    console.log(req.session.currentUser)
    res.render('user-profile', { userInSession: {...req.session.currentUser } });
});



router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcrypt.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                console.log(req.session)
                res.redirect('/user-profile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router