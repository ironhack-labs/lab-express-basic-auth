const express = require("express");
const router = express.Router();
//const bcrypt = require('bcrypt');
const bcryptjs = require(`bcryptjs`);
const User = require("../models/User.model.js")

router.get('/signup', (req, res, next) =>
    res.render('login/signup'));

const saltRounds = 10


router.post('/signup', (req, res, next) => {
    const { username, Userpassword } = req.body;
    //console.log(username)
    bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(Userpassword, salt))
        .then((hashedPassword) => {
            //console.log('hola', hashedPassword)
            return User.create({ username, password: hashedPassword })
        })
        .then((usersDB) => {
            //console.log(usersDB);
            res.redirect('/');
        })
        .catch(err => {
            res.redirect('/');
        });
});


router.get('/login', (req, res, next) => {
    res.render('login/auth/login');
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('login/auth/login', {
            errorMessage: 'Please write username and password to login.'
        });
        return;
    }

    User.findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render('/auth/login', {
                    errorMessage: 'No user has been found. Try again'
                });
                return;
            } else if (bcryptjs.compareSync(password, foundUser.password)) {

                req.session.currentUser = foundUser;
                res.redirect('/userProfile');
            } else {
                res.render('/login', { errorMessage: 'Password is incorrect!' });
            }
        })
        .catch(error => {
            console.log(`error logging in due to ${error}`);
        });
});


router.get('/userProfile', (req, res, next) => {
    res.render('users/userProfile', { userInSession: req.session.currentUser });
});

router.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
})

module.exports = router


