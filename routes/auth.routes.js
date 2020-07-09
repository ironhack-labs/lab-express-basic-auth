const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

///////////////////////////////////////////////////
////////////////////// SIGNUP /////////////////////
///////////////////////////////////////////////////
router.get('/signup', (req, res)=> res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.render('auth/signup', { errorMesage: 'All fields are mandatory. Please provide your username, email and password.'});
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!regex.test(password)){
        res.status(500)
            .render('auth/signup', {errorMesage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one upprcase letter.'});
        return;    
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            console.log('Newly created user is: ', userFromDB);
            res.redirect('/user-profile')
        })
        .catch(error => {
            if(error instanceof mongoose.Error.ValidationError){
                res.status(500).render('auth/signup', {errorMesage: error.message});
            } else if (error.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMesage: 'Username and email need to be unique. Either username or email is already user'
                });
            } else {
                next(error);
            }
        })
    
})


///////////////////////////////////////////////////
////////////////////// LOGIN //////////////////////
///////////////////////////////////////////////////
router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const {email, password} = req.body;

    if(email === '' || password === ''){
        res.render('auth/login', {
            errorMesage: 'Please enter both, email and password to login.'
        });
        return;
    }

    User.findOne({email})
        .then(user => {
            if(!user){
                res.render('auth/login', { errorMesage :  'Email is not registered. Try with other email.'});
                return;        
            }
            bcryptjs
                .compare(password, user.passwordHash)
                .then(success => {
                    if(success){
                        req.session.currenUser = user;
                        return res.redirect('/userProfile')
                    }
                    res.render('auth/login', {errorMesage: 'Incorrect password'});
                })
                .catch(err => {
                    throw new Error(err);
            });
        })
    .catch(error => next(error));
});


///////////////////////////////////////////////////
////////////////////// LOGOUT /////////////////////
///////////////////////////////////////////////////

router.post('/logout', (req, res)=> {
    req.session.destroy();
    req.redirect('/');
});

// Protegendo rota privada
router.get('/userProfile', (req, res) => {
    console.log('your sess exp: ', req.session.cookie.expires);
    if(req.session.currenUser){
        return res.render('users/user-profile', { userInSession: req.session.currenUser})
    }

    res.redirect('/login');
});




module.exports = router;