const {Router} = require('express');
const router = new Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model')


//MAIN & PRIVATE
router.get('/main', (req, res, next) => {
    if(!req.session.currentUser){
        res.render('auth/main', {errorMessage: 'You are not logged in!'})
    } else {
        res.render('auth/main', {success: 'Welcome!'})
    }
})

router.get('/private', (req, res, next) => {
    if(!req.session.currentUser){
        res.render('auth/private', {errorMessage: 'You are not logged in!'})
    } else {
        res.render('auth/private', {success: 'Private'})
    }
})


//LOGIN
router.get('/login', (req, res, next) => {
    res.render('auth/login');
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.render('auth/login', {errorMessage: 'All fields are required.'});
        return;
    }

    User.findOne({email})
        .then(userFromDB =>{
            if (!userFromDB) {
                res.render('auth/login', {errorMessage: 'Incorrect email entered.'});
                return;
            } else if (bcrypt.compareSync(password, userFromDB.passwordHash)) {
                req.session.currentUser = userFromDB;
                res.redirect('/main');
            } else {
                res.render('auth/login', {errorMessage: 'Incorrect password entered.'})
            }
        })
})

// SIGNUP
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
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
            res.redirect('/login')
        })
        .catch(err => console.log('Error while signing up: ', err))
})

module.exports = router;