const mongoose = require('mongoose')
const NewUser = require('../models/user.model')


module.exports.login = (req, res, next) => {
    res.render('users/login')
}

module.exports.signup = (req, res, next) => {
    res.render('users/signup')
}

module.exports.doCreateUser = (req, res, next) => {
    let user = new NewUser(req.body)

    user.save()
        .then(() => {
            res.redirect("/login");
        })
        .catch((error) => {
            console.log(error)
        })
}

module.exports.doLogin = (req, res, next) => {
    NewUser.findOne({ name: req.body.name })
        .then(user => {
            console.log("hola he entrado")
            if (user) {
                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            res.redirect('/tweets')
                        } else {
                            res.render('users/login', {})
                        }
                    })
            } else {
                res.render("users/login");
            }
        })
        .catch(next)
}

module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/login')
}