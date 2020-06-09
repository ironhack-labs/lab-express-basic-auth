const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model')

const saltRounds = 10;

/* GET auth pages */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    bcrypt.genSalt(saltRounds)
    .then(salt => (bcrypt.hash(password,salt)))
    .then(hashedPassword => {
        User.create({ username: username, password: hashedPassword })
        .then(user => {
            console.log("Usuario creado con exito :", user)
            res.redirect('/profile')
        })
        .catch(err => {
            console.log(`Error : ${err}`)
            res.render('signup')
        })
    })
    .catch(err => console.log(`Error : ${err}`))
});

router.get('/profile', (req, res, next) => {
    res.render('users/profile');
});

module.exports = router;
