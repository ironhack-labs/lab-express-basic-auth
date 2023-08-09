const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const saltRounds = 10;
const User = require('../models/User.model');
const isLoggedOut = require('../middleware/isLoggedOut');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/signup', isLoggedOut, (req,res)=>{
    res.render('auth/signup');
});

router.post('/signup', isLoggedOut, (req,res,next)=>{
    const {username, password} = req.body;
    if (!username || !password){
        res.status(400).render('auth/signup', {
            errorMessage: 'All fields are mandatory. Please provide your username and password.'
        });
        return;
    }
    if (password.length < 6) {
        res.status(400).render('auth/signup', {
            errorMessage: 'Your password needs to be at least 6 character long.'
        });
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)){
        res.status(400).render('auth/signup', {
            errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.'
        });
        return;
    }
    bcrypt.genSalt(saltRounds)
    .then((salt)=>bcrypt.hash(password, salt))
    .then((hashedPassword)=>{
        return User.create({username, password: hashedPassword});
    })
    .then((user)=>{
        res.redirect('/login');
    })
    .catch((error)=>{
        if (error instanceof mongoose.Error.ValidationError){
            res.status(500).render('auth/signup', {errorMessage: error.message});
        }
        else if (error.code === 11000){
            res.status(500).render('auth/signup', {errorMessage: 'Username needs to be unique. Provide a valid username.'

            }); 
        }
        else{
            next(error);
        }
    });
});
router.get('/login', isLoggedOut, (req,res)=>{
    res.render('auth/login');
});

router.post('/login', isLoggedOut, (req,res,next)=>{
    const {username, password} = req.body;
    if (!username || !password ){
        res.status(400).render('auth/login', {errorMessage: 'All fields are mandatory. Please provide usarname and password.'});
        return;
    }
    User.findOne({username}).then((user)=>{
        if (!user){
            res.status(400).render('auth/login', {errorMessage: 'No user with this username'});
            return;
        }
        bcrypt.compare(password, user.password).then((isSamePassword)=>{
            if (!isSamePassword){
                res.status(400).render('auth/login', {errorMessage: 'Wrong password.'});
                return;
            }
            req.session.currentUser = user.toObject();
            delete req.session.currentUser.password;
            res.redirect('/');
        })
    .catch((error)=> next(error));
    })
    .catch((error)=> next(error));
});

router.get('/logout', isLoggedIn, (req,res)=>{
    req.session.destroy((error)=>{
        if (error){
            res.status(500).render('auth/logout', {errorMessage: error.message});
            return;
        }
        res.redirect('/');
    });
});

module.exports = router;