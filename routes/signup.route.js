const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password){
        res.render('auth/signup', {
            errorMessage: 'All fields are mandatory. Please provide your username and password',
        });
    return;
    }
    
    bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
        return User.create({username, password: hashedPassword})
    })
    .then(res.redirect('/'))
    .then(console.log(User))
});
module.exports = router;