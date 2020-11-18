const express = require('express');
const app = require('../app');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require("bcryptjs");

const salt = 10;

/* Get sign up page */
router.get('/signup', (req,res) => {
    res.render('auth/signup')
})

/* Get login page*/
router.get('/login', (req,res) => {
    res.render('auth/login')
})

/* Post results from form in db */
router.post('/signup', (req,res) => {
    const {username, password} = req.body;

    // Check if username is unique
    if (!username || !password){
        res.render('auth/signup', {
            errorMessage: 'Please fill out all fields'
        })
    }

    //Check if user is unique and create in db
    User.findOne({username})
    .then(foundUser => {
        console.log("Found user: ", foundUser)
        
        //check if user exists
        if(foundUser){
            console.log('Existing')
            res.render('auth/signup', {
                errorMessage: 'This username is already been taken, choose another one!'
            })
            return
        }

        // Hash password (async)  could also synch
        bcrypt.genSalt(salt)
        .then(generatedSalt =>{
            return bcrypt.hash(password, generatedSalt);
        })
        .then(hashedPassword => {
            console.log(hashedPassword)
            // Create new user in db
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then((userCreated) => {
            console.log('A user is created in db: ', userCreated)
            req.session.user = userCreated; 
            res.render('index', {userCreated} )
        })  
    })
    .catch((err) => {
        console.log('there has been an error ', err)
        res.render('auth/signup', {
            errorMessage: err.message
        })
    })
})

/* Post results from login form */
router.post('/login', (req,res) => {
    const {username, password} = req.body;
    console.log(password)

    // if something is missing in form
    if(!username || !password){
        res.render('auth/login', {
            errorMessage: 'Please fill out all fields'
        })
        return   
    }

    //Find username
    User.findOne({username})
    .then(userFromDB => {
        // no user from DB
        if(!userFromDB){
            res.render('auth/login', {
                errorMessage: 'Your username doesnt seem to be correct'
            })
            return
        }

        // compare passwords
        console.log(userFromDB.password)
        bcrypt.compare(password, userFromDB.password)
        .then(isSamePassword => {
            // no same password
            if(!isSamePassword){
                res.render('auth/login', {
                    errorMessage: 'Your password is wrong, retry!'
                })
                return
            }

            //samePassword
            req.session.user = userFromDB;
            res.render('index', {userLogin: userFromDB} )
        })
    })
    .catch(err =>  {
        console.log('There has been an error')
        res.render('auth/login', {
            errorMessage: err.message
        })
    })
})  

module.exports = router;