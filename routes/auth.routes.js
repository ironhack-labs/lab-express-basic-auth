const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { isLoggedIn } = require('../middlewares/route-guard');
const { isLoggedOut } = require('../middlewares/route-guard');

const saltRounds = 10;

// Render signup form
router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

// Handle signup form submission
router.post('/signup', (req, res, next) => {
    const { username, plainPassword } = req.body;
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.render('main'))
        .catch(err => next(err));
});

// Render login form
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Handle login form submission
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellena todos los campos' });
        return;
    }
    User.findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' });
                return;
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' });
                return;
            }
            req.session.currentUser = foundUser;
            res.render('main');
        })
        .catch(err => next(err));
});

router.get('/main', isLoggedIn, (req, res) => {
    res.render('main');
});

router.get('/private', isLoggedIn, (req, res) => {
    res.render('private')
})

router.get('/close-session', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router;
