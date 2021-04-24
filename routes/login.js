const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const passport = require('passport')

router.get('/login', (req, res, next) => {
    res.render('login')
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(userExist => { 
            if (userExist === null) {   
            res.render('login', { message: 'The username or the password are incorrect'});
            return
            }
            bcrypt.compare(password, userExist.password).then(passCorrect => {
                console.log(passCorrect)
                if (passCorrect === true) { 
                    req.session.user = userExist;
                    res.redirect('/profile')
                }
            })
        })
})

router.get('/profile', (req, res, next) => {
    res.render('profile')
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/login')
        }
    })
})

module.exports = router;