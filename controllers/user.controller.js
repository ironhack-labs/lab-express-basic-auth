const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');

module.exports.register = (req, res, next) => {
    res.render("user/register");
}

module.exports.doRegister = (req, res, next) => {
    User.create(req.body)
        .then(user => {
            if (user) {
                res.redirect('/')
            } else {
                res.render('/register', {
                    ...req.body,
                    error: 'Something went wrong.'
                })
            }
        })
        .catch(next);
}

module.exports.login = (req, res, next) => {
    res.render('user/login');
}

module.exports.doLogin = (req, res, next) => {
    const { username, password } = req.body;
    if (username === '' || password === '') {
        res.render('user/login');
    };

    User.findOne({username})
        .then(user => {
            console.log(user.password);
            console.log(user);
            if (!user) {
                res.render('user/login');
            } else if (bcryptjs.compareSync(password, user.password)) {
                res.redirect('/');
            } else {
                res.render('user/login');
            }
        })
        .catch(next)
}
