const mongoose = require('mongoose');
const User = require('../models/User.model.js');

module.exports.register = (req, res, next) => {
    res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {
    const user = { name, email, password} = req.body;

    const renderWithErrors = (errors) => {
        res.render('auth/register', {
            errors: errors,
            user: user
        });
    };
    
    User.findOne({ email: user.email })
        .then((userFounded) => {
            if (userFounded) {
                renderWithErrors({ email: 'Email already in use!' });
            } else {
                return User.create(user).then(() => res.redirect('/'));
            }
        })
        .catch(err => {
            if (err instanceof mongoose.Error.ValidationError) {
                renderWithErrors(err.errors);
            } else {
                next(err);
            }
        });
}