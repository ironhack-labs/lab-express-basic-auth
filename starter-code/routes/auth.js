const express = require('express');
const router = express.Router();

const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
    res.render('signup');
})

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username}, "username", (err, user) => {
        if (user !== null ) {
            res.render('signup', { message: "This user already exists"});
            return;
        }
    
        const salt     = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser =  User({
            username,
            password: hashPass
        });
        
        newUser.save((err) => {
            if (err) {
                res.render('signup', { message: "something went wrong"});
            } else {
                res.redirect('/');
            }
        }); 
    });
});

router.get('/login', (req, res, next) => {
    res.render('login');
})

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ "username": username}, (err, user) => {
        if (err || !user) {
            res.render('login', { errorMessage: "The username doesn't exist"});
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/');
        } else {
            res.render("login", { errorMessage: "Incorrect password"});
        }
    });
});



module.exports = router;