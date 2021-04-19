const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 10;
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res, next) => {
    res.render('signup');
})

router.post('/signup', (req, res, next) => {
    const {username, password } = req.body;
    if(!username || !password) {
        res.render('signup', { errorMessage: "Username and password are requiered" });
    }

    User.findOne({ username })
    .then( user => {
        if(user) {
            res.render('signup', { errorMessage: "User already exists" });
        }

        const salt = bcrypt.genSaltSync(saltRound);
        const hashPassword = bcrypt.hashSync(password, salt);

        User.create({ username, password: hashPassword })
        .then(() => res.render('index'))
        .catch(error => res.render('signup', { errorMessage: error }))
    })
    .catch()
})

module.exports = router;