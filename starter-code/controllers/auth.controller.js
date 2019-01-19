const User = require('../models/user.model');
const mongoose = require('mongoose');

module.exports.register = (req, res, next) => {
    res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {
    User.findOne({email: req.body.email })
        .then(user => {
            if (user) {
                res.render('auth/register', { 
                    user: req.body,
                    errors: {
                        email: 'email alredy registered' ,
                    }
                })
            } else {
                user = new User({
                    email: req.body.email,
                    password: req.body.password
                })
                return user.save()
                    .then(user => res.redirect('/auth/login'))
            }
           
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('auth/register', {
                    user: req.body,
                    errors: error.errors
                })
            } else {
                next(error);
            }
        });
}

module.exports.login = (req, res, next) => {
    res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password){
        res.render('auth/login',{
            user: req.body,
            errors: {
                email: email ? undefined : 'Email is required',
            }
        })
    } else {
        User.findOne({ email: email })
        .then(user => {
            if (!user){
                res.render('auth/login',{
                    user: req.body,
                    errors: {
                        email: 'Invalid email or password', 
                    }
                })
            } else {
                return user.checkPassword(password)
                .then(match => {
                    if (!match){
                        res.render('auth/login', {
                            user: req.body,
                            errors: {
                              email: 'Invalid email or password',
                            }
                        })
                    } else {
                        req.session.user = user;
                        res.redirect('/auth/main');
                    }
                })
            }
        })
        .catch(error => next(error));
    }
}

module.exports.main = (req, res, next) => {
    const user = req.session.user;
    res.render('auth/main', { user: user });
}

module.exports.private = (req, res, next) => {
    const user = req.session.user;
    res.render('auth/private', { user: user });
}