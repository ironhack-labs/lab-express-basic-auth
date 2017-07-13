const express = require('express');
const router = express.Router();

const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
    res.render('signup');
})

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const catchUser = null;
    const newUser =  User({
        username,
        password: hashPass
    });
    
    // const User = mongoose.model('User', userSchema );
    
    User.findOne({ 'username': username }, (err, user) => {
        if (err) {
            throw err;
        } else {
            catchUser = user;
            }
    })

    if (catchUser === null) {
            newUser.save((err) => {
            res.redirect('/secret');
        })
    } else {
        res.render('signup' , { "message": "Already exists" })
    }

    
});

module.exports = router;