const User = require('../models/User.model')

module.exports.signup = (req, res, next) => {
    res.render('signup-form')
}

module.exports.doSignup = (req, res, next) => {

    User.create(req.body)
    .then((user) => {
        console.log(`The user ${user.username} has been created`)
        res.redirect('/')
    })
    .catch((err) => {
        console.error(err)
        res.render('signup-form', { user: req.body, err })
    })
}