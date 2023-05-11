// Require Express to help to create Routes
const {Router} = require('express');

// To encrypt the password
const bcryptjs = require('bcryptjs');

// Round of Encription
const saltRounds = 10;

// Require Mongoose
const mongoose = require('mongoose');

// Require User Model
const User = require('../models/User.model');

const router = new Router();

// SingUp //

// GET Route to display the form for ther new user
route.get('/singup', (req, res)=>{
    res.render('auth/singup.hbs');
})

// POST Route to get the information from the form
route.post('/singup', (req, res)=>{
    const {username, password} = req.body;

    if(!username || !password){
        res.render('auth/singup', {erroMessage: 'All fields are mandatory. Please add your username and your password.'});
        return;
    }

    async function encriptPassword(){
        try{
            let salt = await bcryptjs.genSalt(saltRounds);

            let hashedPassword = await bcryptjs.hash(password, salt);
        }
        catch(error){
            if(error instanceof mongoose.Error.ValidationError){
                res.status(500).render('auth/singup', {errorMessage: error.message});
            }
            else if(error.code === 11000){
                res.status(500).render('auth/singup', {errorMessage: 'Username must be unique.'});
            }
            else{
                console.log(error);
            }
        }
    }
    encriptPassword();
});