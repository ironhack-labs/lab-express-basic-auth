const {Router} = require('express');
const router = new Router();
const mongoose = require("mongoose");
const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');

const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js');

const saltRounds = 10;

router.get('/signup', isLoggedOut, (req,res,next)=>{
    res.render('auth/signup');
});

router.post('/signup', async (req,res, next)=>{
    try{
        const {username, email, password} = req.body;
        
        if(!username || !password){
            res.render('auth/signup', {errorMessage: 'All fields are mandatory to be filled to signup'});
            return; 
        }

        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if(!regex.test(password)){
            res.status(500).render('auth/signup', {errorMessage: 'Password needs at least 6 characters and must have, at least, 1 uppercase letter'})
        }

        let salt = await bcryptjs.genSalt(saltRounds);
        let hashedPassword = await bcryptjs.hash(password, salt); 
        
        let newUser = await User.create({
            username, 
            email, 
            password: hashedPassword
        })

        res.redirect('/login');
    }
    catch(error){ 
        if(error instanceof mongoose.Error.ValidationError){
            res.status(500).render('auth/signup', {errorMessage: error.message});
        }
        else if( error.code === 11000){
            res.status(500).render('auth/signup', {errorMessage: 'User not found and/or incorrect password'});
        }
        else {
            next(error);
        }
    }
})

router.get('/login', isLoggedOut, (req,res)=>{
    res.render('auth/login');
});

router.post('/login', async (req,res,next)=>{
    const {email, password} = req.body; 
    try{
    if(email === '' ||  password === ''){
        res.status(400).render('auth/login',        {errorMessage: 'Please enter both, email and password'});
        return;
    }

    let foundUser = await User.findOne({email});
    if(!foundUser){
        res.status(500).render('auth/login', {errorMessage: 'User not found'})
    } else if (bcryptjs.compareSync(password, foundUser.password)){
        req.session.currentUser = foundUser;
        res.redirect('/profile');
    }
    else {
        res.status(500).render('auth/login', 
        {errorMessage: 'Incorrect password'})
    }
}
    catch(error){

    }
})

router.post('/logout', (req,res,next)=>{
    req.session.destroy(err=>{
        if(err){
            next(err);
        }
        res.redirect('/');
    })
});



/* User Profile */

router.get('/profile', isLoggedIn, (req,res)=>{
    res.render('user-profile', {userInSession: req.session.currentUser});
})

module.exports = router; 