const router = require("express").Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

router.get("/signup", (req, res, next) => {
    res.render("signup");
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;

    if (password.length < 8) {
        res.render('signup', {message: 'Your password needs at least 8 characters'});
        return
    }

    if (username === '') {
        res.render('signup', {message: 'You cannot sign up without a username' });
        return
    }

    User.findOne({username: username})
    .then(userFromDb => {
        if (userFromDb !== null) {
            res.render('signup', {message: 'This username has already been taken. Choose a new one!'});
        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            User.create({username: username, password: hash})
            .then(newUser => {
                res.redirect('/');
            })       
        }
    })
})

module.exports = router;