const mongoose = require("mongoose")
const User = require("../models/User.model")
const {
    sendActivationEmail
} = require("../configs/mailer.config")

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
                                .then((user) => { //la u es de user

                                    //AQUI SE PONE LA LOGICA PARA ENVIAR EL MAIL DE ACTIVACION

                                    sendActivationEmail(user.email, user.activationToken) //el mail y token salen del modelo

                                    res.render('users/mails')
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
                    .catch(e => next(e))
            }
        })
        .catch(e => next(e))

};

module.exports.logout = (req, res, next) => {
    req.session.destroy()

    res.redirect('/')
};

module.exports.profile = (req, res, next) => {

    res.render('users/profile')
};

module.exports.main = (req, res, next) => {
    res.render('users/main')
};

module.exports.private = (req, res, next) => {
    res.render('users/private')
};

module.exports.activate = (req, res, next) => {
    User.findOneAndUpdate({
            activationToken: req.params.token,
            active: false
        }, {
            active: true,
            activationToken: "active"
        })
        .then((u) => {
            //si encuentras el usuario
            if (u) {
                res.render('users/login', {
                    user: req.body,
                    message: "Congratulations, your account is active!",
                });
            } else {
                res.redirect('/')
            }

        })
        .catch((e) => next(e))
};