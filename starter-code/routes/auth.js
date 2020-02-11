const express = require('express');
const authRouter  = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const zxcvbn = require("zxcvbn");
const saltRounds = 10;




//GET route to get signup
authRouter.get('/', (req, res, next) => {
    res.render('auth/signup');
});

//POST route to get data
authRouter.post('/', (req, res, next) => {
    const { username, password} = req.body;
    console.log("Print req.body", req.body)
    if(username === "" || password === ""){
        res.render("auth/signup", {
            errorMessage: "Please provide the required username and password"
        });
        return;
    };

    //Check if user already exists
    User.findOne({username})
    .then( (user) => {
        if(user!== null) {
            res.render("auth/signup", {
                errorMessage: "This username is already taken, please choose another username"
            });
            return;
         };
    
    // Create user
        const salt = bcrypt.genSaltSync(saltRounds);  
        const hashedPassword = bcrypt.hashSync(password, salt);

        User.create({username, password: hashedPassword})
        .then( (user) => {
        res.redirect('/index')
        })
        .catch(err => console.log(err))
    });
});


module.exports = authRouter;