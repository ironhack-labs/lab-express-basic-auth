const User = require('../models/User.model');
const mongoose = require('mongoose');

module.exports.registerForm = (req, res, next) => {
    res.render('user/register')
}

module.exports.register = (req, res, next) => {

    function renderWithErrors(errors) {
        res.status(400).render('user/register', {
            errors: errors,
            user: req.body
        })
    }

    User
        .findOne({ username: req.body.username })
        .then(user => {
            if(user){
                renderWithErrors({
                    username: 'Ya existe un usuario con este nombre de usuario'
                })
            } else {
                User
                    .create(req.body)
                    .then(() => {
                        res.redirect('/')
                    })
                    .catch(e => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderWithErrors(e.errors)
                        } else {
                            next(e)
                        }
                    })
                
            }
        })
}