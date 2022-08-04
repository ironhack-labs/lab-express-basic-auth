const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/login', (req, res, next) => res.render('auth/login'))

router.post('/login', (req, res, next) => {
    const {email, password} = req.body;
    
    if (!email || !password){
        res.render('auth/login', {
            errorMessage: 'All fields are mandatory'
        });
        return;
    } 
    
    User.findOne({email})
    .then((user) => {
        if (!user) {
            res.render('auth/login', {
              errorMessage: 'Email was not found',
            });
            return;
        }
        else if (bcrypt.compareSync(password, user.password)){
    
            req.session.currentUser = user;
        }
        else res.render('auth/login', {
            errorMessage: 'Incorrect password, please try again'
        })
    })
});

module.exports = router;