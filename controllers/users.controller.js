const User = require('../models/User.model');
const mongoose = require('mongoose');


// Render Home
module.exports.index = (req, res, next) => {
    User.find()
        .then(users => {
            res.render('index', {
                users: users
            })
        })
        .catch((e) => next(e))
}


// Render register
module.exports.register = (req, res, next) => {
    res.render('new-user')
}

// Render con validación de doRegister
module.exports.doRegister = (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                res.render('new-user', {
                    errors: {
                        email: 'There is already an account registered with this email'
                    },
                    user: {
                        email: req.body.email
                    }
                })
            } else {
                User.create(req.body)
                    .then(() => {
                        res.redirect('/')
                    })
                    .catch((e) => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            res.render('new-user', {
                                errors: e.errors,
                                user: {
                                    email: req.body.email
                                }
                            })
                        } else if (e.code === 11000) {
                            res.render('new-user', {
                                errors: {
                                    email: 'There is already an account registered with this email'
                                },
                                user: {
                                    email: req.body.email
                                }
                            })
                        } else {
                            next(e)
                        }
                    })
            }
        })
        .catch((e) => next(e))
}

// Render login
module.exports.login = (req, res, next) => {
    res.render('login')
}

// Validación del login
module.exports.doLogin = (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (!user) {
                res.render('login', {
                    errorMessage: 'Invalid email or password',
                    user: {
                        email: req.body.email
                    }
                })
            } else {
                return user.checkPassword(req.body.password)
                    .then((match) => {
                        if (match) {
                        req.session.currentUser = user // Para crear la cookie
                        res.redirect('/profile')
            } else {
                res.render('login', {
                    errorMessage: 'Invalid email or password',
                    user: {
                        email: req.body.email
                    }
                })
              }
            })
        }
      })
        .catch((e) => next(e))
}

// Profile
module.exports.profile = (req, res, next) => {
    res.render('profile')
}

// Main
module.exports.main = (req, res, next) => {
    res.render('main')
}

module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/main');
}