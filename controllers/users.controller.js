const mongoose = require('mongoose')
const User = require('../models/user.model')

module.exports.login = (req, res, next) => {
    res.render('users/login')
}

module.exports.signup = (req, res, next) => {
    res.render('users/signup')
}

module.exports.doLogin = (req, res, next) => {
    User.findOne({ name: req.body.name })
        .then(user => {
            if (user) {
                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            req.session.userId = user._id
                            console.log("hola he entrado")
                            res.redirect('/main')
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
module.exports.doCreateUser = (req, res, next) => {
    let user = new User(req.body)

    user.save()
        .then(() => {
            res.redirect("/login");
        })
        .catch((error) => {
            console.log(error)
        })
}


module.exports.goToMainWeb = (req, res, next) => {
    res.render('main')
}

module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/login')
}