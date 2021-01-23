const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const User = require('../models/User.model');
const { Mongoose } = require('mongoose');


router.get('/authentication/signup', (req, res, next) => {
    res.render('authentication/signup')
});


router.post('/signup', (req, res, next) => {

const {username, password} = req.body;

//to send a message to user that all fields are mandatory 
if(!username || !password){
    res.render('authentication/signup', {errorMessage: 'All fields are mandatory, please provide username and password!'});
    return;
}

//if we want to crate a rule for password: to be a digit, to have at least 1 lowercase letter, one uppercase letter, and to be at least 6 characters long 
const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})/;
if(!regex.test(password)){
    res.render('authentication/signup', {errorMessage:'Password needs to be at least 6 characters long and needs to have at least one number, one lowercase and one uppercase letter.'})
}


bcryptjs
.genSalt(10)
.then(salt => bcryptjs.hash(password, salt))
.then(passwordHash => {
    return User.create({username, hashedPassword: passwordHash})
    .then(userFromDB => console.log(userFromDB))
})
.catch(err=> {
    if(err.code === 11000){
        //if we have same user already
        res.render('authentication/signup', {errorMessage:'User already exist in database, please try to Log in or Sign up with different Username.'})
    } else if (err instanceof mongoose.Error.ValidationError){
        //if we want to show messages from User.model (required username, password)
        res.render('authentication/signup', {errorMessage:'Please provide valid password.'})
    }else {
        console.log('Error while creating a user:', err)
    }
});
})


router.get("/authentication/login", (req, res, next) => {
    res.render("authentication/login.hbs");
  });



router.post('/login', (req, res, next) =>{
    const {username, password} = req.body;

    if (!username || !password){
        res.render('authentication/login', { 
            errorMessage: 'All fields are required.Please provide both, username and password.'});
            return;
    }

    User.findOne({username})
    .then(responseFromDB => {
        if (!responseFromDB){
            res.render('authentication/login', {errorMessage:'username is not registered.Try again with different'})
        } else if(bcryptjs.compareSync(password, responseFromDB.hashedPassword)){
            req.session.currentUser = responseFromDB;
            res.redirect('/private');
        }else {
            res.render('authentication/login', {errorMessage: 'Incorrect password'})
        }
    })
    .catch(err=>console.log('Error while user login:', err))
});

router.get('/private', (req, res, next)=>{
    res.render("authentication/private", {userInSession: req.session.currentUser});
});

router.get('/main', (req, res, next)=>{
    res.render("authentication/main", {userInSession: req.session.currentUser});
});

module.exports = router;
