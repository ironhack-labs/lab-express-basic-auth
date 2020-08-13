const {Router} = require('express');
const router = new Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
});

router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        res.render('auth/signup', {errorMessage: 'All fields are required'});
        return;
    }

    const reqex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!reqex.test(password)) {
        res.status(500).render('auth/signup', {errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'});
        return;
    }

    bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            console.log('New user: ', userFromDB)
            res.redirect('/userProfile')
        })
        .catch(err => console.log('Error while signing up: ', err))
})

module.exports = router;