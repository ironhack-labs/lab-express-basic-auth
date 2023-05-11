const {Router} = require('express');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// require the User Model 
const mongoose = require('mongoose');
const User  = require('../models/User.model');

const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard');

const router = new Router();

router.get('/signup', (req, res)=>{
    res.render('auth/signup');
})

router.post('/signup', (req,res)=>{
    const {username, password} = req.body;

    // Make sure users fill all mandatory fields
    if(!username || !password){
        res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please add your username, password and e-mail, if you may.'});
        return;
    }

    async function encriptPassword(){
        try{
        let salt = await bcryptjs.genSalt(saltRounds);
        let hashedPassword = await bcryptjs.hash(password, salt);

        await User.create({
            username, 
            password: hashedPassword,
        }); 

        res.redirect('/profile');
    }
    catch(error){

        if (error.code === 11000){
            res.status(500).render('auth/signup', {errorMessage: 'Username must be unique.'});
        }
        else{
            console.log(error);
        }
    }
    }
    encriptPassword();
});

router.get('/profile', (req, res)=>{
    res.render('auth/profile'); //{userInSession: req.session.currentUser});
});


// LOGIN // 

// GET Route to display the login form to the user 
router.get('/login', (req,res)=>{
    res.render('auth/login');
});

// POST Route to validate the user

router.post('/login', (req,res)=>{
    console.log(req.session);
    const {username, password} = req.body;

    if(username === '' || password===''){
        res.render('auth/login', {
            errorMessage: 'Please fill all the required fields.'
        });
        return;
    }

    async function manageDb(){
        try{ 
            let user = await User.findOne({username});
            if(!user){
                res.render('auth/login', {errorMessage: 'Username not found.'})
            } else if (bcryptjs.compareSync(password, user.password)){
                //req.session.currentUser = user; 
                res.redirect('/Profile');
            } else {
                res.render('auth/login', {errorMessage: 'Wrong Password'})
            }
        }
        catch(error){
            console.log(error);
        }
    }

    manageDb();
});
// POST Route to logout
router.post('/logout', (req, res)=>{
    // Kill the Session
    req.session.destroy(err=>{
        if(err){
            console.log(err);
        }
    // Redirect to Homepage
    res.redirect('/');
    })
})

/// Export Router
module.exports = router; 