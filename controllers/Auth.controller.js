const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.register = (req, res, next) => {
    res.render('auth/register');
};

module.exports.doRegister = (req, res, next) => {
    const user = req.body;
    User.findOne({ email: user.email })
        .then((userFound) => {
            if(userFound) {
                console.log('Ya existe este usuario :' + userFound)
                res.render("auth/register", {
                    user,
                    error: {
                        emailExist: 'This email alredy exist',
                    },
                })
                return;
            } else {
                return User.create(user)
                    .then((userCreated) => {
                        console.log('User created' + userCreated);
                        res.redirect('/profile', { user });
                    })
            }
        })
        .catch(err => {
            console.log('errors', err);
            res.render('auth/register', {
                user,
                errors: err.errors,
            });
            next(err)
        })
};