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
    if (username === '' || password === '') {
        res.render('auth/signup', {
            errorMessage: 'Please enter both, username and password to create an account.'
        });
        return;
      }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
        .status(500)
        .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
    
    bcrypt.genSalt(saltRounds)
    .then(salt => (bcrypt.hash(password,salt)))
    .then(hashedPassword => {
        User.create({ username: username, password: hashedPassword })
        .then(user => {
            req.session.currentUser = user
            console.log("Usuario creado con exito :", user)
            res.redirect('/profile')
        })
        .catch(err => {
            console.log(`Error : ${err}`)
            res.render('auth/signup', {errorMessage: 'Sorry, this username already exists'})
        })
    })
    .catch(err => console.log(`Error : ${err}`))
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;
    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to login.'
        });
        return;
      }
    User.findOne({username})
    .then(user => {
        if (!user) {
            res.render('auth/login', {errorMessage: "Sorry, this user doesn't exist"})
            return
        } else if (bcrypt.compareSync(password,user.password)) {
            req.session.currentUser = user
            res.redirect('/profile')
        } else {
            res.render('auth/login', {errorMessage: "Incorrect password"})
        }
    })
    .catch(err => console.log(`Error : ${err}`))
});

router.get('/profile', (req, res, next) => {
    res.render('users/profile', {userSession : req.session.currentUser});
});

router.post('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/');
});

module.exports = router;
