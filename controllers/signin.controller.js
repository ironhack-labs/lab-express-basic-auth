const User = require('../models/User.model.js')
const mongoose = require('mongoose')

exports.indexRender = (req, res, next) => { res.render('index')}
exports.signinRender = (req, res, next) => { res.render('createUser'), { user: new User()}}
exports.createUser = (req, res, next) => {
  const user = new User(req.body)
  user.save()
    .then(() => res.redirect('/sucessfull'))
    .catch(err => {
        res.render('createUser', { error: err.errors, user})
    })
}
exports.createSuccesfull = (req, res, next) => {res.render('sucessfull')}

module.exports.login = (req, res, next) => {
    res.render('login')
  }
  
module.exports.doLogin = (req, res, next) => {
User.findOne({ username: req.body.username })
    .then(user => {
    if (user) {
        user.checkPassword(req.body.password)
        .then(match => {
            if (match) {
            req.session.userId = user._id
            
            res.redirect('/sucessfullLogin') // create route and view
            } else {
            res.render('login', {
                error: {
                username: {
                    message: 'user not found'
                }
                }
            })
            }
        })
    } else {
        res.render("login", {
        error: {
            password: {
            message: "user not found",
            },
        },
        });
    }
    })
    .catch(next)
}

module.exports.sucessfullLogin = (req, res, next) => {
    res.render('sucessfullLogin')
  }

module.exports.logout = (req, res, next) => {
    console.log(req.session)
    req.session.destroy()

    res.redirect('/login')
}
