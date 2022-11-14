const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');

router.get('/create', (req, res, next) => {
    res.render('auth/create');
});
router.get('/login', (req, res, next) => {
    res.render('auth/login');
});
router.get('/user', (req, res) => {
    const user = req.session.user;
    res.render('user/index', user);
});

router.post('/create', (req, res, next) => {
    const { username, password } = req.body;
    UserModel
        .findOne({ username })
        .then((user) => {
            if (user) {
                res.render('auth/create', {
                    messageError: 'Este usuario ya existe.'
                });
            } else {
                UserModel
                    .create({ username, password })
                    .then(() => {
                        res.redirect('/auth/login');
                    })
                    .catch((err) => next(err));
            }
        });

});
router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    UserModel
        .findOne({ username })
        .then((user) => {
            if (!user) {
                res.render('auth/login', {
                    messageError: 'Email o contraseña incorrectos.'
                })
                return;
            }

            const verifyPass = bcrypt.compareSync(password, user.password);

            if (verifyPass) {
                req.session.user = user;
                res.redirect('/auth/user');
            } else {
                res.render('auth/login', {
                    messageError: 'Email o contraseña incorrectos.'
                });
            }
        })
        .catch((err) => next(err));

});

module.exports = router;