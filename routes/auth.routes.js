// Require Express Method that helps us to create Routes
// 2nd way of requiring Router 
const {Router} = require('express');
// bcrypt is a npm package that encrypts passwords
const bcryptjs = require('bcryptjs');
// rounds of encription
const saltRounds = 10;

// require the User Model 
const mongoose = require('mongoose');
const User  = require('../models/User.model');

const router = new Router();

// Require Auth Middleware
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard');

// SIGNUP //

// GET Route --> display the 'signup' form to the user
router.get('/signup', (req, res)=>{
    res.render('auth/signup.hbs');
})


// POST Route --> to post info of the form and create a new user
router.post('/signup', (req,res)=>{
    const {username, email, password} = req.body;


    // Make sure my password is strong 

    // Makes sure that you have at least one lowercase letter, one uppercase letter and 6 digits. 
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!regex.test(password)){
        res.status(500).render('auth/signup', {errorMessage: 'Password needs to have at least 6 characters, 1 lowercase letter and 1 uppercase letter'});
        return;
    }

    // Make sure users fill all mandatory fields
    if(!username || !email || !password){
        res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please add your username, password and e-mail, if you may.'});
        return;
    }

    async function encriptPassword(){
        try{
        // salt is a random string
        let salt = await bcryptjs.genSalt(saltRounds);
        // combines salt and password
        let hashedPassword = await bcryptjs.hash(password, salt);
        
        // save to DB 
        let newUser = await User.create({
            username, 
            email, 
            passwordHash: hashedPassword,
        }); 

        // Redirect to User Profile 
        res.redirect('/userProfile');
    }
    catch(error){
        if(error instanceof mongoose.Error.ValidationError){
            // HTTP Response Codes
            // 200 - successful response
            // 4xx - client-side error;
            // 404 - not found on client;
            // 5xx - server-sider error; 
            // 505 - not found on server; 
            // 11000 - native MongoDB error --> you tried to sumbit a value that was created before. 
                    // same email / same username as other user. 

            res.status(500).render('auth/signup', {errorMessage: error.message});
        } 
        else if (error.code === 11000){
            res.status(500).render('auth/signup', {errorMessage: 'Username and email must be unique. Choose an username / email that are original, if you may.', });
        }
        
        else{
            console.log(error);
        }
    }
    }

    encriptPassword();
});

router.get('/userProfile', isLoggedIn, (req, res)=>{
    res.render('user/user-profile.hbs', {userInSession: req.session.currentUser});
});


// LOGIN // 

// GET Route to display the login form to the user 
router.get('/login', (req,res)=>{
    res.render('auth/login.hbs');
});

// POST Route to validate the user

router.post('/login', (req,res)=>{
    console.log(req.session);
    const {email, password} = req.body;

    // Validade if the user submitted email / password blank
    if(email === '' || password===''){
        res.render('auth/login.hbs', {
            errorMessage: 'Please fill all the required fields, if you may.'
        });
        return;
    }

    async function manageDb(){
        try{ 
            let user = await User.findOne({email});
            if(!user){
                res.render('auth/login', {errorMessage: 'Email is not registered. Try other, if you may.'})
            } else if (bcryptjs.compareSync(password, user.passwordHash)){
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
// // POST Route to logout
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