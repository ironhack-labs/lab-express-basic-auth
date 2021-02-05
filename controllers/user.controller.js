// const e = require('express');
const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.profile = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => res.render('users/userProfile', user))
        .catch(err => next(err))
};

module.exports.signup = (req, res, next) => res.render('auth/signup');

module.exports.doSignup = (req, res, next) => {
    // function renderWithErrors(errors) {
    //     res.status(400).render('auth/signup', {
    //       errors: errors,
    //       user: req.body
    //     })
    //   }

    User.find({email: req.body.email})
        .then(user => {
            if (user) {
                renderWithErros({
                    email: 'This email is already registered.'
                });
            } else {
                User.create(req.body)
                    .then(() => res.redirect('/'))
                    .catch(err => {
                        err instanceof mongoose.Error.ValidationError ? renderWithErrors(err.error) : next(err);
                    })
            }
        })
        .catch(err => next(err));

};