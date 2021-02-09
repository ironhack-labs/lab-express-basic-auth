const mongoose = require("mongoose")
const User = require("../models/User.model")

module.exports.register = (req, res, next) => {
    res.render('register')
}

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
    res.status(400).render('register', {
      errors: errors,
      user: req.body
    })
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    email: "Email already exists"
                })
            }
            else {
                User.create(req.body)
                    .then(() => {
                        //console.log(user)
                        res.redirect("/")
                    })
                    .catch(e => {
                        if (e instanceof mongoose.Error.ValidationError) {  //Errores de validación del modelo
                            renderWithErrors(e.errors) // errors => objeto de los errores que se han dado
                        } else {
                            next(e)
                        }
                    })
            }
        })
        .catch((e)=> next(e))
}

module.exports.login = (req, res, next) => {
    res.render ('login')
}

module.exports.doLogin = (req, res, next) => {
    function renderWithErrors() {
        res.status(400).render('login', {
            error: "Email or password invalid",
            user: req.body
        })
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                renderWithErrors()
            } else {
                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            req.session.currentUserId = user.id
                            res.redirect ('/profile')
                        } else {
                            renderWithErrors()
                        }
                })
            }
        })
        .catch(e=> next(e))
}

module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
}

module.exports.profile = (req, res, next) => {
    res.render('profile')
}