const mongoose = require('mongoose');
const User = require('../models/User.model');

//SIGN UP 
module.exports.signUp = (req, res, next) => {
    res.render('sign-up-form')
}

module.exports.doSignUp = (req, res, next) => {
    
    User.create(req.body)
    .then(user => {
        console.log(user);
        res.render('users/profile', { user })
    })
}