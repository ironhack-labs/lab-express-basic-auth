const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


module.exports.register = (req, res, next) => {
    res.render('register');
};

module.exports.doRegister = (req, res, next) => {
    const {username, password} = req.body;
    bcrypt.hash(req.body.password, 10)
        .then((password) => {
            return User.create({
                ...req.body,
                password
            }).then((username) => res.redirect('/'))            
        })
        .catch(next)       
};

module.exports.login = (req, res, next) => {
    res.render('login');
};

module.exports.doLogin = (req, res, next) => {
    User.findOne({ username: req.body.username }).then((user) => {
        if(user) {
            bcrypt.compare(req.body.password, user.password).then((match) => {
                if(match) {
                    res.redirect('/');
                } else {
                    res.render('login', {errors: { password : 'invalid password'}});
                }
            });
        } else {
            res.render('login', {errors: { username : 'invalid username'}});
        }
    })
    .catch(next)
};






