const {Router} = require('express');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// require the User Model 
const mongoose = require('mongoose');
const User  = require('../models/User.model');

const router = new Router();

// Require Auth Middleware
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard');


//SIGN UP
//GET Route to display form
router.get('/signup', isLoggedOut, (req, res)=>{
    res.render('auth/signup.hbs');
})

router.post('/signup', (req, res)=>{
    
    const {username, password} = req.body;

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!regex.test(password)){
        res.status(500).render('auth/signup', {errorMessage: 'Password needs to have at least 6 characters, 1 lowercase letter and 1 uppercase letter'});
        return;
    }

    // Make sure users fill all mandatory fields
    if(!username || !password){
        res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please add your username and password, NOW!'});
        return;
    }

    async function encryptPassword(){
        try{
        // salt is a random string
        let salt = await bcryptjs.genSalt(saltRounds);
        // combines salt and password --> FUSION, AHH! 
        let hashedPassword = await bcryptjs.hash(password, salt);
        //console.log(`Password hash: ${hashedPassword}`);

        
        // save to DB 
        let newUser = await User.create({
            username, 
            password: hashedPassword,
        }); 

        // Redirect to User Profile 
        res.redirect('/login');
    }
    catch(error){
        if(error instanceof mongoose.Error.ValidationError){
            // HTTP Response Codes
            // 200 - successful response
            // 4xx - client-side error;
            // 404 - not found on client;
            // 5xx - server-side error; 
            // 505 - not found on server; 
            // 11000 - native MongoDB error --> you tried to submit a value that was created before. 
                    // same username as other user. 

            res.status(500).render('auth/signup', {errorMessage: error.message});
        } 
        else if (error.code === 11000){
            res.status(500).render('auth/signup', {errorMessage: 'Username must be unique. Choose an username that are original, if you may.', });
        }
        
        else{
            console.log(error);
        }
    }
    }
    encryptPassword();
});

// LOGIN

// GET Route to display the login form to the user 
router.get('/login', (req,res)=>{
    res.render('auth/login.hbs');
});

router.post('/login', (req, res)=>{
    const {username, password} = req.body;

    // Validate if the user submitted username / password blank
    if(username === '' || password === ''){
        res.render('author/login', {
            errorMessage: 'Please fill all the required fields'
        });
        return
    }

    async function manageDb(){
        try{
            let user = await User.findOne({username});
            if(!user){
                res.render('auth/login', {errorMessage: 'Username is not registered. Try other, if you may.'})
            } else if (bcryptjs.compareSync(password, user.password)){
                console.log('loggedin');
                req.session.currentUser = user; 
                res.redirect('/userProfile');
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

/// Export Router
module.exports = router; 