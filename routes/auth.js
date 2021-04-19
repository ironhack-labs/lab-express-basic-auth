const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRound = 10;

router.get('/signup', (req, res) => {
    console.log("Is in get")
    res.render('signup');
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    if(!username || !password){
        console.log("required");
        res.render('signup', {errorMessage: "Username and password are required"})
    }

    User.findOne({username})
    .then((user) => {
        if(user){
            res.render('signup', {errorMessage: "User already exists"})
        }
        const salt = bcrypt.genSaltSync(saltRound);
        const hashPassword = bcrypt.hashSync(password, salt);

        User.create({username, password: hashPassword})
        .then(() => {
            res.render('index')
        }) 
        .catch((error) => next(error))   
    })
})

module.exports = router;
