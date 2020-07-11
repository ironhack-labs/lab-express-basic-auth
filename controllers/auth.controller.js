const mongoose = require('mongoose');
const User = require('../models/User.model');

/*SIGN UP*/
module.exports.signup = (req, res) => res.render('auth/signup');

module.exports.createUser = (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(() => res.redirect('/auth/login'))
        .catch(() => res.redirect('/signup', user));
}

/*LOGIN*/
module.exports.login = (req, res) => res.render('auth/login');

module.exports.doLogin = (req, res) => {
    res.send('skeree')
};