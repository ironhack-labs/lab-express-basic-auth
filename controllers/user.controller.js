const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.register = (req, res, next) => {
    res.render("user/register");
}

module.exports.doRegister = (req, res, next) => {
    User.create(req.body)
        .then(user => res.redirect('/'));
}
