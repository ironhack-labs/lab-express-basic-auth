//jshint esversion:8
const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;
const isLoggedIn = require('../middleware/route-guard');
const mongoose = require("mongoose");

/********************* S I G N U P **********************/

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;

    if (username === '' || password === '') {
        res.render('auth/signup', {
          errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPass => {
            //console.log(`Password hash: ${hashedPass}`);
            return User.create({username, password: hashedPass});
        })
        .then(userFromDB => {
            console.log('Newly created user is: ', userFromDB);
            res.redirect('/login');
        })
        .catch(error => {

            if(error instanceof mongoose.Error.ValidationError){
                res.status(500).render('auth/signup', {errorMessage: error.message});

            } else if (error.code === 11000) {
                res.status(500).render('auth/signup', {errorMessage: `Username need to be unique. ${username} already exists. Please choose another.`});
            } else {
                next(error);
            }
            
        });

});

/********************* L O G I N **********************/

router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
          errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }
    User.findOne({username})
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {

                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));

});

/********************* P R O F I L E **********************/

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

/********************* M A I N **********************/
router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('users/main', { userInSession: req.session.currentUser });
});

/********************* P R I V A T E **********************/
router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('users/private', { userInSession: req.session.currentUser });
});
module.exports = router;