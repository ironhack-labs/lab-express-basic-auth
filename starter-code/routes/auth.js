const express = require("express");
const router = express.Router();

const User = require('../models/user.js');

const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
});

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const bcryptSalt = 10;
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if(username.lenght <=0) {
        res.render('auth/signup', {
            errorMessage: 'le champs utilisateur doit être renseigné.'
        })
        return;
    } else if(password.lenght <=0) {
        res.render('auth/signup', {
            errorMessage: 'le champs password doit être renseigné.'
        })
        return;
    }

    User
        .findOne({username: req.body.username})
        .then(user => {
            if(user) {
                res.render('auth/signup', {
                    errorMessage: `l\'utilisateur ${user} existe déjà.`
                })
                return;
            }

            User.create({
                username: username,
                password: hashPass
              })
              .then(res => {
                res.redirect('/')
              })
              .catch(error => {
                next(error);
              })
        })
        .catch(error => next(error))    
})

router.get('/main', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('/main', {user: req.user});
})

router.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('/private', {user: req.user});

})