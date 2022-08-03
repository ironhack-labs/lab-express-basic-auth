const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')


router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
        return User.create({
            username,
            passwordHash: hashedPassword,
        })
    })
    .catch((error) => next(error))
})

router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        res.render('auth/login', {message: 'Please fill in the empty spaces.'})
        return;
    }

    User.findOne({ username })
    .then(user => {
        if(!user) {
            res.render('auth/login', {message: 'Username not found'});
            return;
        } else if(bcryptjs.compareSync(password, user.passwordHash)){
            req.session.currentUser = user;
            res.redirect('/userProfile')
            /* res.render('user-profile', { user }); */
        } else {
            res.render('auth/login', {message: 'Password incorrect'})
        }
    })
    .catch(error => next(error))
})

router.get('/userProfile', (req, res, next) => {
    res.render('/user-profile', { userInSession: req.session.currentUser })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if(err) next(err);
        res.redirect('/');
    });
});







module.exports = router;