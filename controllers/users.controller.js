const User = require('../models/User.model')

module.exports.login = (req, res, next) => {
    res.render('users/login')
}

