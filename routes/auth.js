const express = require('express');
const User = require("../models/User.model");
const bcrypt = require('bcryptjs');
const router = express.Router();
const saltRound = 10;

router.get('/signup', (req,res) => {
    res.render('signup');
})

router.post('/signup', (req, res, next) => {
    const { username, email, password} = req.body;

    if(!username || !password || !email) {
        res.render('signup', {errorMessage: "Username, email and password are required"})
    }

    User.findOne({ $or: [{ username }, { email } ]})
    .then(user => {
        if(user){
            res.render('signup', {errorMessage: "User already exists"});
        }

        const salt = bcrypt.genSaltSync(saltRound);
        const hashPassword = bcrypt.hashSync(password, salt);

        User.create({ username, email, password: hashPassword})
        .then(() => {
            res.render('index');
        })
        .catch((error) => next(error))
    })
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        res.render('login', { errorMessage: "Email and password are required"})
    }

    User.findOne({ email })
    .then(user => {
        if(!user){
            res.render('login', { errorMessage: "Incorrect email or password"})
        }

        const passwordCorrect = bcrypt.compareSync(password, user.password);
        if(passwordCorrect){
            req.session.currentUser = user;
            res.redirect('/private/profile')
        } else {
            res.render('login', { errorMessage: "Incorrect email or password"})
        }
    })
})


module.exports = router;