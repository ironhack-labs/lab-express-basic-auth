const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.signup = (req, res, next) => {
    res.render('auth/signup');
};