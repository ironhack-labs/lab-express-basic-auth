const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');
const router  = express.Router();

//Iteration 1
// Sign Up & Add User
router.get('/signup', (req,res,next) =>{
    res.render('auth-views/signup-form')
});

router.post('/adduser', (req,res,next) =>{
    const { userName, originalPassword} = req.body;
    if (!originalPassword || !userName || originalPassword.match(/[0-9]/) === null){
        req.flash("error", "Username and Password cannot be blank and must contain a number");
        res.redirect('/signup');
        return;
    }
    const username = userName.toLowerCase()
    User.findOne({userName: {$eq: username}})
    .then(userDoc =>{
        if (userDoc){
            req.flash("error", "UserName is not available");
            res.redirect('/signup');
            return;
        }

        const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
        User.create({username, encryptedPassword})
        .then(userDoc =>{
            req.flash("success", "Created Successfully");
            res.redirect('/');
        })
        .catch(err =>next(err))
    })
    .catch(err =>next(err))
});

//Iteration 2
//Log In
router.get('/login', (req,res,next)=>{
    res.render('auth-views/login-form');
});

router.post('/check-login', (req,res,next)=>{
    const {userName, originalPassword} = req.body;
    User.findOne({userName: {$eq: userName}})
    .then(userDoc =>{
        if (!userDoc){
            req.flash("error", "Username not found");
            res.redirect('/login');
            return;
        }
    const {encryptedPassword} = userDoc;
    if (!bcrypt.compareSync(originalPassword, encryptedPassword)){
        req.flash("error", "Incorrect Password");
            res.redirect('/login');
        } else {
            req.flash("success", "log In Sucess");
            res.redirect('/');
        }
    })
    .catch(err=>next(err));
});


module.exports = router;