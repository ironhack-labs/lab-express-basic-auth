const mongoose = require("mongoose")
const User = require("../models/User.model")
module.exports.register = (req, res, next) => {
    res.render('users/register')
}
module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render('users/register', {
            errors: errors,
            user: req.body
        })
    }
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    email: 'Este mail ya ha sido registrado'
                })
            } else {
                User.create(req.body)
                    .then(() => {
                        res.redirect('/')
                    })
                    .catch(e => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderWithError(e.errors)
                        } else {
                            next(e)
                        }
                    })
            }
        })
        .catch(e => next(e))
}

module.exports.login = (req, res, next) => {
    res.render('users/login')
}

module.exports.doLogin = (req, res, next) => {
    function renderWithErrors() {
        res.status(400).render('users/login', {
            user: req.body,
            errors: 'El ususario o contraseña no es correcto',

        })
    }

    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (!user) {
                renderWithErrors()
            } else {
                user.checkPassword(req.body.password)
                    .then((match) => {
                        if (!match) {
                            renderWithErrors()
                        } else {
                            // creare la sesión
                            req.session.currentUsersId = user.id //este user es el user que tengo arriba
                            res.redirect('/profile')
                        }
                    })
            }
        })
        .catch(e => next(e))

}

module.exports.logout = (req, res, next) => {
    req.session.destroy()

    res.redirect('/')
}

module.exports.profile = (req, res, next) => {

    res.render('users/profile')
}