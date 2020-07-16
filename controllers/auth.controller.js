const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

/*SIGN UP*/
module.exports.signup = (req, res) => res.render('auth/signup');

module.exports.createUser = (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(() => res.redirect('/auth/login'))
        .catch(() => res.redirect('/signup', user));
}

/*LOGIN*/
module.exports.renderLogin = (req, res) => res.render('auth/login');

module.exports.doLogin = (req, res) => {
    const {name, password} = req.body 

    if (name === '' || password === '') {
        res.render('auth/login', {errorMessage: 'One or more fields are empty'});
    }

    User.findOne({name: name})
    .then(user => {
         bcrypt.compare(password, user.password)
            .then(match => {
                if(match) {
                    req.session.userId = user._id;
                    res.send('yay');
                }
                else {
                    res.render('auth/login', {errorMessage: 'Authentication failed: Wrong credentials'})
                }
            })
            .catch(e => console.error(e));
    })
    .catch(res.render('auth/login', {errorMessage: 'Authentication failed: Wrong credentials'}));
};
