// routes/auth.routes.js
const { Router } = require('express');

// bcrypt is a npm package that encrypts passwords
const bcryptjs = require('bcryptjs');
// rounds of encription
const saltRounds = 10;

// require the User Model 
const mongoose = require('mongoose');
const User  = require('../models/User.model');

const router = new Router();

// Iteration 1 | Sign Up
// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

// POST route ==> to process form data
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
   
    async function encriptPassword(){
        try{
        // salt is a random string
        let salt = await bcryptjs.genSalt(saltRounds);
        // combines salt and password --> FUSION, AHH! 
        let hashedPassword = await bcryptjs.hash(password, salt);
        //console.log(`Password hash: ${hashedPassword}`);

        
        // save to DB 
        let newUser = await User.create({
            username, 
            email, 
            passwordHash: hashedPassword,
        }); 
        res.redirect('/userProfile');
    }
      catch(error){
        console.log(error);
    }
  };
  encriptPassword()
})

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile');
})

// Iteration 2 | LOGIN
// GET route ==> to display the login form to users
router.get('/login', (req, res) => {
    res.render('auth/login')
});

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.render('auth/login', {
          errorMessage: 'Please enter both, email and password to login.'
        });
        return;
      }

    async function findUser(){
        try{ 
            let user = await User.findOne({email});
            if(!user){
                res.render('auth/login', {errorMessage: 'Email is not registered.'})
            } else if (bcryptjs.compareSync(password, user.passwordHash)){ 
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', {errorMessage: 'Wrong Password'})
            }
        }
        catch(error){
            console.log(error);
        }
    }
    findUser();
})


module.exports = router;
