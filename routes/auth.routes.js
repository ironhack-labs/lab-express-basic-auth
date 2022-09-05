const router = require('express').Router()
UserModel = require('../models/User.model')
bcrypt = require('bcryptjs')

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.get('/login', (req, res) => {
    res.render('auth/login')
}),

    router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/auth/login');
    });

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
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
    let userOne;

    UserModel.findOne({ username })
        .then((userDb) => {
            console.log(username)
            userOne = userDb;
            return bcrypt.compare(password, userOne.password);
        })
        .then((isPassword) => {
            if (isPassword) {
                req.session.user = userOne;
                res.redirect('/profile');
            } else {
                res.render('auth/login', {
                    message: 'Usuario o contraseña incorrecta',
                });
            }
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;