//require express
const router = require('express').Router();

//require user model
const User = require('../models/User.model');

//require mongoose
const mongoose = require('mongoose')

//require Bcrypt
const bcryptjs = require('bcryptjs');

// Require auth middleware
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js');

// saltRounds gives us the time that the password is going to be hashed
const saltRounds = 10;


/* SIGNUP ROUTES */

/* GET route to render signup apge */
router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup')
});

/* POST route to grab the info from the user filled form */
router.post('/signup', async (req, res, next) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            res.render('auth/signup', {errorMessage: 'All fields are mandatory to be filled to signup'});
            return; 
        }

        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if(!regex.test(password)){
            res.status(500).render('auth/signup', {errorMessage: 'Password needs at least 6 characters and must have, at least, 1 uppercase letter'})
        }

        // generate the salt (extra data to password), in 10 saltRounds
        let salt = await bcryptjs.genSalt(saltRounds);
        let hashedPassword = await bcryptjs.hash(password, salt); 
        
        let newUser = await User.create({
            username, 
            password: hashedPassword
        })

        res.redirect('/login');
    }
    catch(error){
        // If the error that was catched is a Mongoose Validation Error ... 
        if(error instanceof mongoose.Error.ValidationError){
            // HTTP Request / Response Status Code
            // 2XX -> Success
            // 4XX -> Client-Side Error
            // 5XX -> Server-Side Error
            // 11XX -> MongoDB Errors

            // .. then, send a HTTP response status of 500 (server-side error)
            // and display an error Message on the FrontEnd
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

/* LOGIN */

//GET route to display the login form
router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

//POST route to submit the user-filled info
router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    try{
        if(username === '' || password === ''){
            res.status(400).render('auth/login', {errorMessage: 'Please enter both, username and password'});
            return;
        }

        //find a User that has the same username that was prompted
        let foundUser = await User.findOne({username});
        if(!foundUser){
            res.status(500).render('auth/login', {errorMessage: 'User not found'})
        }
        else if(bcryptjs.compareSync(password, foundUser.password)){
            req.session.currentUser = foundUser;
            res.redirect('/profile');
        }
        else{
            res.status(500).render('auth/login', 
        {errorMessage: 'Incorrect password'})
        }

    }
    catch (error){
        console.log(error)
    }
})


/* LOGOUT */
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

/* GET main page */
router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("main");
  });
  
/* GET private page */
router.get("/private", isLoggedIn, (req, res, next) => {
res.render("private");
});

module.exports = router;