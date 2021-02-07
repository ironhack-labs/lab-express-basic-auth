const mongoose = require('mongoose');
const User = require("../models/user.model")

module.exports.register = (req, res, next) => {
    res.render('users/register');
}

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        console.log(errors)
        console.log(`error: ${errors.password}`)
        res.status(404).render('users/register', {
            errors: errors,
            user: req.body
        })
    }
    if (req.body.password !== req.body.repeatPassword) {
        renderWithErrors({
            password: 'Repeat password'
        })
    } else {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    renderWithErrors({
                        email: 'There is already a user with this email'
                    })
                } else {
                    User.create(req.body)
                        .then(() => {
                            res.redirect('/')
                        })
                        .catch((err) => {
                            if (err instanceof mongoose.Error.ValidationError) {
                                renderWithErrors(err.errors)
                            } else {
                                next(err)
                            }
                        })
                }
            })
            .catch(err => next(err))
    }
}

module.exports.login = (req, res, next) => {
    res.render('users/login')
}

module.exports.doLogin = (req, res, next) => {
    function renderWithErrors() {
        res.render('users/login', {
            user: req.body,
            error: 'The email or password is not correct'
        })
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                renderWithErrors()
            } else {
                user.checkPassword(req.body.password)
                    .then(match => {
                        console.log('user: ' + user)
                        console.log('match: ' + match)

                        if (match) {
                            req.session.currentUserId = user.id
                            res.redirect('/profile')
                        } else {
                            renderWithErrors()
                        }
                    })
            }
        })
        .catch(e => next(e))
};

module.exports.profile = (req, res, next) => {
    res.render('users/profile')
};

module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
};