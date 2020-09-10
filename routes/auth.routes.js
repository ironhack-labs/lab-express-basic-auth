const express = require('express');
const router = express.Router();

//add salt
const bcrypt = require('bcrypt')
const saltRounds = 10

const User = require('../models/User.model')

router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    console.log(req.body)
    bcrypt.hash(password, saltRounds)
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then(data => {
            console.log(data)
            res.redirect('/auth/user')
        })
        .catch(err => {
            next(err)
        })
})
router.get('/user', (req, res, next) => {
    res.render('user')
})

module.exports = router;