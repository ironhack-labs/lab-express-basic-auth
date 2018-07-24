const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password) return res.render('auth/signup', {message: 'Los campos son obligatorios'});
    User.findOne({username})
        .then(user => {
            if(user){
                return res.render('auth/signup', {message: 'Usuario ya existente'});
            } else {
                const salt  = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(password, salt);
                const newUser = new User({username, password: hashedPassword});
                return newUser.save();
            }
        })
        .then(user => {
            req.session.currentUser = user;
            res.redirect('/');
        })
        .catch(error => {
            next(error);
        });
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password) return res.render('auth/login', {message: 'Los campos son obligatorios'});
    User.findOne({username})
        .then(user => {
            if (!user) return res.render('auth/login', {message: 'No existe el usuario'});
            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect('/');
            } else {
                res.render('/login', {message: 'Contraseña incorrecta'});
            }
        })
        .catch(error => {
            next(error);
        });
});

router.post('/logout', (req, res, next) => {
    delete req.session.currentUser;
    res.redirect('/login');
});

module.exports = router;
