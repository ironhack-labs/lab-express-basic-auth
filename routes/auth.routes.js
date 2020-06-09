const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
;
/* GET auth page */

router.get('/signup', (req, res, next) => res.render('auth/signup'));
router.get('/userProfile', (req, res, next) => res.render('users/profile', { userInSession: req.session.currentUser }));

router.post('/signup', (req, res, next) => {
    //console.log(req.body);
    const {
        username,
        email,
        password
    } = req.body;

    if(!username || !email || !password){
        res.render('auth/signup', {errorMessage: 'Please, add a user name, an email and a password'});
        return; //não permite que a execuçao siga. 
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!regex.test(password)){
        res.render('auth/signup', { errorMessage: 'The password must have a-z, A-B, and at least 6 characters'})
    }

    bcryptjs.genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            console.log('The hash is: ', hashedPassword);
            User.create({
                username: username,
                email: email,
                passwordHash: hashedPassword
            })
            .then(user => {
                console.log ('user created', user)
                req.session.currentUser = user
                res.redirect('/userProfile')
            })
            .catch(err => {
                if(err instanceof mongoose.Error.ValidationError){
                    res.status(500).render('auth/signup', {
                        errorMessage: err.message
                    });   
                } else if(err.code === 11000){
                    res.status(500).render('auth/signup', {
                        errorMessage: 'Username or email still exists'
                    });
                } else {
                    next(err)
                }
            })
        })
});

// LOGIN //

router.get('/login', (req, res) => {
    console.log('SESSION =====> ', req.session);
    res.render('auth/login');
})

router.post('/login', (req, res, next) => {

    const { username, password } = req.body;

    if(username === '' || password === ''){
        res.render('auth/login', {
            errorMessage: 'Please, enter your username and password to login'
        }); 
        return;
    } 

    User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //res.render('users/profile', { user });
        req.session.currentUser = user; //sessão do usuário que se conectou
        res.redirect('/userProfile'); //redirecionar o usuário a sua página de perfil
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

//LOGOUT

router.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;