const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

//Landing page where you also have the sign up
router.get('/signup', (req, res, next) => {
    res.render('signup')
});

//This is the post request that does EVERYTHING
router.post('/signup', (req, res, next) => {
    const {username: username, password: password} = req.body;

    //Check if password is long enough & username is entered
    //remember to return after each if-statement, otherwise messages won't be rendered together
    if (password.length < 8){
        res.render('signup', {message: 'Your password needs to be longer than 8 characters.'});
        return;
    }
    if (username === ''){
        res.render('signup', {message: 'You need to declare a username.'});
        return;
    }

    //Username & password are okay: now necessary to check whether username is already taken
    User.findOne({username: username})
    .then(newUser => {
        if (newUser !== null){
            res.render('signup', {message: 'This username is already taken.'});
        } else {
            //generate the salt to encrypt password
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            //generate new user
            User.create({username: username, password: password})
            .then(createdUser =>{
                console.log(createdUser);
                res.render('signup', {message: 'Yay! You have successfull signed up.'});
            })
        }
    }) 
})

module.exports = router;
