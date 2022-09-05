const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');


router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.get('/sign-up', (req, res, next) => {
    res.render('auth/sign-up')
})

router.post('/sign-up', (req, res, next) => {
    const { username, password } = req.body
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
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    let user;
    UserModel.findOne({ username })
        .then((userDb) => {
            user = userDb;
            console.log(user)
            return bcrypt.compare(password, user.password);
        })
        .then((isPassword) => {
            console.log("hola")
            if (isPassword) {
                console.log(user)
                req.session.user = user;
                res.redirect('/profile');
            } else {
                res.render('auth/login', {
                    message: 'Ususario o contraseña incorrecta!',
                });
            }
        })
        .catch((err) => {
            next(err);
        });
})


module.exports = router;

