const router = require("express").Router();
const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => {
        return bcryptjs.hash(password, salt)
    })
    .then(hashedPassword => {
        return User.create({
            username,
            passwordHash: hashedPassword
        });
    })
    .then(() => {
        res.redirect('/userProfile');
    })
    .catch(error => next(error));
})

router.get('/userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;