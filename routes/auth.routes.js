const router = require('express').Router();
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
    console.log('entra')
    res.render('auth/signup');
});

router.get('/login', (req, res) => {
    UserModel.find()
        .then((users) => {
            res.render('auth/login', { users });
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
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
    let user;

    UserModel.findOne({ username })
        .then((userDb) => {
            if (!userDb) {
                res.render('auth/login', {
                    message: 'Usuario o Contraseña incorrecta❗️',
                });
            }
            user = userDb;
            return bcrypt.compare(password, user.password);
        })
        .then((isPassword) => {
            if (isPassword) {
                req.session.user = user;
                console.log("QUE HAY AQUI===>", user)
                res.redirect('/user');
            } else {
                res.render('auth/login', {
                    message: 'Usuario o Contraseña incorrecta❗️',
                });
            }
        })
        .catch((err) => {
            next(err);
        });
});


module.exports = router;
