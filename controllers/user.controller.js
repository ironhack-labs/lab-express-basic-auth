const createError = require('http-errors');
const { default: mongoose } = require('mongoose');
const User = require('../models/User.model')

module.exports.signup = (req, res, next) => {
    res.render('user/signup')
};

module.exports.doSignup = (req, res, next) => {

    const renderWithErrors = (errors) => {
        res.render('user/signup', {
            user: {username: req.body.username},
            errors
        })
    }

    User.findOne({username: req.body.username})
    .then(user => {
        if (!user) {
            //si no encuentra otro registro con el mismo username, lo crea
            return User.create(req.body)
            .then(user => {
                res.render('user/confirmation')
                console.info(`${user.username} has been created!`)
            })
        } else {
            renderWithErrors({username: 'Sorry! Username already in use, try with another one :)'})
        }
    })

    .catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
            renderWithErrors(err.errors)
        } else {
            next(err)
        }
    })
};