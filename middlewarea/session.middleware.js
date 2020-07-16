const User = require('../models/User.model')
const { model } = require('mongoose')

module.exports.isAuthenticated = (req, res, next) => {
    User.findById(req.session.userId)
        .then(user => {
            if (user) {
                req.currentUser = user
                next()
            } else {
                res.redirect('/users/login')
            }
        })
}