const mongoose = require('mongoose');
const User = require('../models/User.model');

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
};

module.exports.login = (req, res, next) => {
    res.render('auth/login');
};

module.exports.doLogin = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then((userFound) => {
            if(userFound) {
                return userFound.checkPassword(password)
                    .then((match) => {
                        if(!match) {
                            res.render('auth/login', {
                                errors: {
                                    password: 'Invalid email or password',
                                    email: 'Invalid email or password'
                                },
                                user: req.body
                            });
                        } else {
                            req.session.userId = userFound._id;
                            res.redirect('/profile');
                        }
                    })
            } else {
                res.render('auth/login', {
                    errors: {
                        email: 'Invalid email or password',
                        password: 'Invalid email or password'
                    }
                });
            }
        })
        .catch((e) => next(e));
}

module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
};