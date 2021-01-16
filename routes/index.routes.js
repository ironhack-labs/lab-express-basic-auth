const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res, next) => res.render('signup'));

router.post('/signup', (req, res, next) => {

    bcrypt.hash(req.body.password, 10).then(function(hash) {
        UserModel.create({
            name: req.body.name,
            password: hash
        }).then(() => res.redirect('/index')).catch(err => console.log(err));
    });
});

router.get('/login', (req, res, next) => res.render('login'));

router.post('/login', (req, res, next) => {

    UserModel.findOne({ name: req.body.name }).then(user => {
        bcrypt.compare(req.body.password, user.password).then(function(result) {
            if (result) {
                req.session.currentUser = user;
                res.redirect('/main');
            } else {
                req.body.error = 'user not found';
                res.render('/login', req.body);
            }
        });
    }).catch(err => console.log(err));
});

router.get('/main', (req, res, next) => {

    if (req.session.currentUser) {
        res.render('main');
    } else {
        res.redirect('/login');
    }
});

router.get('/private', (req, res, next) => {
    if (req.session.currentUser) {
        res.render('private');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;