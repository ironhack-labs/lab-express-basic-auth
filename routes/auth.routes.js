const router = require('express').Router();
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * GET
 */
router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});


/**
 * POST
 */

router.post('/signup', (req, res, next) => {
    const { username, password, } = req.body;
    console.log(password)
    bcrypt
        .genSalt(10)
        .then((salts) => {
            return bcrypt.hash(password, salts);
        })
        .then((pass) => {
            return userModel.create({ password: pass, username });
        })
        .then((user) => {
            res.redirect('/');
        })
        .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    let user;
    userModel.findOne({ username })
        .then((userDb) => {
            user = userDb;
            return bcrypt.compare(password, user.password);
        })
        .then((isPassword) => {
            if (isPassword) {
                req.session.user = user;
                res.redirect('/profile');
            } else {
                res.render('auth/login', {
                    message: 'Usuario o contraseña incorrectos!',
                });
            }
        })
        .catch((err) => next(err));
});





module.exports = router;
