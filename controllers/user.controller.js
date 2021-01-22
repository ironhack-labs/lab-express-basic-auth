const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');

module.exports.register = (req, res, next) => {
    res.render("user/register");
}

module.exports.doRegister = (req, res, next) => {

    function renderWithErrors(errors) {
        res.status(400).render('user/register', {
            errors: errors,
            user: req.body,
        });
    };

    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                renderWithErrors({ username: 'Username is already registered' });
            } else {
                return User.create(req.body).then(() => res.redirect('/'))}
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                renderWithErrors(error.errors);
            } else {
                next(error);
            }
        })
}

module.exports.login = (req, res, next) => {
    res.render('user/login');
}

module.exports.doLogin = (req, res, next) => {
    const { username, password } = req.body;
    if (username === '' || password === '') {
        if (username === '' && password === '') {
            res.render('user/login', {
                user: req.body,
                errors: {
                    username: 'Username is required.',
                    password: 'Password is required.'
                }
            });
        } else if (password === '') {
            res.render('user/login', {
                user: req.body,
                errors: {
                    password: 'Password is required.',
                }
            });
        } else {
            res.render('user/login', {
                errors: {
                    username: 'Username is required.'
                }
            });
        };
    };

    User.findOne({username})
        .then(user => {
            if (user) {
                user.checkPassword(req.body.password)
                    .then((match) => {
                        if (match) {
                            req.session.userId = user.id;
                            res.redirect('/');
                        } else {
                            res.render('user/login', { user: req.body, errors: { password: 'Invalid password '}});
                        }
                    })
            } else {
                res.render('user/login', { user: req.body, errors: { username: 'User not found' }})
            } 
        })
        .catch(next)
}
