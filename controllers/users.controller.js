const User = require('../models/User.model');
const mongoose = require('mongoose');

module.exports.login = (req, res, next) => {
    res.render('users/login')
}
module.exports.loginPost () => {
    User.findOne({ username: req.body.username })
        .then( user => {
            if(user) {
                
            }
        })
}

module.exports.signup = (req, res, next) => {
    res.render('users/signup')
}

module.exports.create = (req, res, next) => {
    const user = new User(req.body)
    //guardar el usuario en la base de datos
    user.save().then(() => {
        res.redirect('/login')
    }).catch((error) => {
        res.render('users/signup', { user, error: error.errors })
    })
} 