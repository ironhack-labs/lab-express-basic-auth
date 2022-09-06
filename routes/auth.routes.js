const router = require('express').Router();
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

// const appTemp = app


router.get('/signup', (req, res) => {
    res.render('auth/sign-up');
});

router.get('/login', (req, res) => {
    const user = req.session.user
    // app.locals.name = user.username
    res.render('auth/login', user);
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    req.app.locals.name = null
    req.app.locals.disabled = true
    res.redirect('/auth/login');
});













router.post('/signup', (req, res, next) => {
    const { password, username } = req.body;
    console.log(password);
    bcrypt
        .genSalt(10)
        .then((salts) => {
            return bcrypt.hash(password, salts);
        })
        .then((pass) => {
            return UserModel.create({ password: pass, username });
        })
        .then((user) => {
            res.redirect('/');
        })
        .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    let user;
    UserModel.findOne({ username })
        .then((userDb) => {
            user = userDb;

            return bcrypt.compare(password, user.password);
        })
        .then((isPassword) => {
            if (isPassword) {
                req.session.user = user;
                res.redirect('/private/main');
            } else {
                res.render('auth/login', {
                    message: 'Ususario o contraseña incorrecta!',
                });
            }
        })
        .catch((err) => {
            res.render('auth/login', {
                message: 'Ususario o contraseña incorrecta!',
            });
        });
});






module.exports = router;