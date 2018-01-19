const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.signup = (req, res, next) => {
    res.render('auth/signup');
}

module.exports.doSignup = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if(user != null) {
                res.render('auth/signup', { user: user, error: { user: "Username already exists" } })
            }
            else {
                user = new User(req.body);
                user.save()
                    .then(() => {
                        res.redirect('/signup');
                    })
                    .catch(error => {
                        if(error instanceof mongoose.Error.ValidationError) {
                            res.render('auth/signup', { user: user, error: error.errors })
                        }
                        else {
                            next(error);
                        }
                    });
            }
        })
        .catch(error => next(error));
}

module.exports.login = (req, res, next) => {
    res.render('auth/login');
}