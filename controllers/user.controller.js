const mongoose = require("mongoose")
const User = require("../models/User.model")

module.exports.register = (req, res, next) => {
    res.render('users/register')
}



module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render('users/error', {
            errors: errors,
            user: req.body
        })
    }

    //que no se repitan los usuarios y mail
    User.findOne({
            //email: req.body.email
            username: req.body.username
        })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    username: 'Este usuario ya ha sido registrado'
                })
            } else {
                User.findOne({
                        email: req.body.email
                            // username: req.body.username
                    })
                    .then((user) => {
                        if (user) {
                            renderWithErrors({
                                email: 'Este email ya ha sido registrado'
                            })

                        } else {
                            User.create(req.body)
                                .then(() => {
                                    res.redirect('/profile')
                                })
                                .catch(e => {
                                    if (e instanceof mongoose.Error.ValidationError) {
                                        console.log(e.errors)
                                        renderWithErrors(e.errors)
                                    } else {
                                        next(e)
                                    }
                                })
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
            errors: 'El email o la contraseña son incorrectos',

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
                            req.session.currentUserId = user.id //este user es el user que tengo arriba
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

module.exports.main = (req, res, next) => {
    res.render('users/main')
}

module.exports.private = (req, res, next) => {
    res.render('users/private')
}