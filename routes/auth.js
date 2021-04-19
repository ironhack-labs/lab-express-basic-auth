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

module.exports = router;