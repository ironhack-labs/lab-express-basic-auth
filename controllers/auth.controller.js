const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.register = (req, res, next) =>  {
    res.render('auth/register')
}

module.exports.doRegister = (req, res, next) => {
    const user = { name, email, password } = req.body;

    User.create(user)
        .then(() => {
            res.redirect('/')
        })
        .catch((e) => console.log(e)) 
}