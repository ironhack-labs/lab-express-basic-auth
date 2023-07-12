const User = require('../models/User.model')

module.exports.singup = (req, res, next) => {
    res.render('auth/signup')
    }

module.exports.doSingup = (req, res, next) => {
    User.create(req.body)
    .then(user => res.redirect('/'))
    .catch(err => {
        console.log(err)
    })
}
