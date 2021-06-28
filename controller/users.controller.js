const User = require('../models/User.model');

module.exports.index = (req, res, next) => {
    User.find()
    .then(users => {
        res.render('index', { users })
    })
}

module.exports.createUser = (req, res, next) => {
    res.render('new-user')
}

module.exports.docreateUser = (req, res, next) => {
    User.Create('req.body')
    .then(() => {
        res.redirect('/')
    })
}