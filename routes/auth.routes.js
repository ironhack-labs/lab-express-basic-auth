const router = require("express").Router();

const User = require("../models/User.model")

const bcryptjs = require('bcryptjs');

// Require auth middleware
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js');

// saltRounds gives is the time that the password is going to be hashed
const saltRounds = 8;

// Route to display form for user to sign up
router.get('/signup', isLoggedOut, (req,res, next)=>{
    res.render('auth/signup.hbs')
});

// POST to submit information from the form
router.post('/signup', async (req,res)=>{
    const {username, password} =req.body;
    try{

        if(!username || !password){
            res.render('auth/signup', {errorMessage: 'All fields are mandatory to be filled to signup'});
            return; 
        }
        
        let salt = await bcryptjs.genSalt(saltRounds);
        let hashedPassword = await bcryptjs.hash(password, salt);

        let newUser = await User.create({username, password:hashedPassword});

        res.redirect('/login');
        }
    catch(error){
        console.log(error)
    }
});

// GET to display the login page to the user
router.get('/login', (req, res)=>{
    res.render('auth/login');
});

// POST to retrieve the login info
router.post('/login', async(req,res)=>{
   
    const {username, password} = req.body;
    
    try {

        if(username === '' ||  password === ''){
            res.status(400).render('auth/login', {errorMessage: ' Enter both! Username And password!'});
            return;
        }

        let foundUser = await User.findOne({username});

        if(!foundUser){
            res.status(500).render('auth/login', {errorMessage: 'User not found'})
        } else if (bcryptjs.compareSync(password, foundUser.password)){
            req.session.currentUser = foundUser;
            res.redirect('/profile');

        }
    }
    catch(error){
        console.log(error)
    }

});

/* LOGOUT */
router.post('/logout', (req,res,next)=>{
    req.session.destroy(err=>{
        if(err){
            next(err);
        }
        res.redirect('/');
    })
});



// User Profile

router.get('/profile', isLoggedIn, (req,res)=>{
    res.render('user-profile', {userInSession: req.session.currentUser});
})

router.get('/main', isLoggedIn, (req,res)=>{

    res.render('cat-pic');

});

router.get('/private', isLoggedIn, (req,res)=>{

    res.render('private-page');

});

module.exports = router;