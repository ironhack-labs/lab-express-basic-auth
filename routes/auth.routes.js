const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard')

//Sign up
router.get('/signup', (req, res)=> res.render('auth/signup'))

router.post('/signup', async (req, res, next)=>{
    try {
        let {username, password} = req.body;
//if the user in any case leaves one of the inputs empty
        if(!username || !password){
            res.render('auth/signup', {errorMessage: 'Please fullfill all the empty fields'})
        }
//this guarantes all the fields

//accepting only secure passwords

const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ // 8 is the minimum amount of characters on the password
if(!regex.test(password)){
    //if the password don't match the regex requeriments, show this error
    res.render('auth/signup', {errorMessage: 'Please insert a password with at least 8 characters with uppercase and lowercase letters'})
}

//encrypting password

const salt = await bcrypt.genSalt(10) //10 times is more than enough
const hashedPassword = await bcrypt.hash(password, salt) //hashing the password, generating 10x a random layer

//Adding the input to the user with the encrypted password
await User.create({username, password: hashedPassword})

//redirecting to homepage as soon as the user logs in
res.redirect('/')


    } catch (error) {
        //if there's an error with mongoose
        if(error instanceof mongoose.Error.ValidationError){
            //show this error message
            res.render('auth/signup', {errorMessage: error.message});
        } else if (error.code === 11000){
            //in this case it will display this error if the user tries do sign up with a username already registered
            res.render('auth/signup', {
                errorMessage: 'Username already in use'
            });
        };

     next(error)   
    };
});


//Login
router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) =>{
    try {
        let {username, password} = req.body
//display an error if the user tries to login without username or password
        if(!username || !password){
            res.render('auth/signup', {errorMessage: 'Please input all the fields'})
        }

        //checking if the username exists

        let user = await User.findOne({username}) //there's no ID so we go by username

        //if the username doesn't exist, throw an error
        if(!user){
            res.render('auth/signup', {errorMessage: "Couldn't find the account"})
        } else if(bcrypt.compareSync(password, user.password)){ //if the password match, user can login

            //saving user in the session
           req.session.user = user

            //when user login, redirect to profile page
            res.redirect('/profile')
        } else {
            //if user exists but password is wrong
            res.render('auth/login', {errorMessage: 'Wrong password'})
        }


    } catch (error) {
        console.log(error)
        next(error)
    }

});

router.get('/profile', isLoggedIn, (req, res) => {
    let user = req.session.user;

    res.render("profile", user)
});

router.get('/main', isLoggedIn, (req, res) => res.render('main'))
router.get('/private', isLoggedIn, (req, res)=> res.render('private'))


router.post('/logout', (req, res, next)=>{
    req.session.destroy((err)=>{
        if(err) next(err)
        else res.redirect('/')
    });
});




module.exports = router;