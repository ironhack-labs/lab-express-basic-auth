const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

//add salt
const bcrypt = require('bcrypt')
const saltRounds = 10

const User = require('../models/User.model');
const { Mongoose } = require('mongoose');

router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.render('signup', { errorMessage: "Pls, put your name and password"})
    }

    if (username != req.body.username) {
        res.render('signup', { errorMessage: "pls use another name"})
    }
   

    console.log(req.body)
    bcrypt.hash(password, saltRounds)
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then(data => {
            console.log(data)
            res.redirect('/auth/user')
        })
        .catch(err => {
            if (err instanceof mongoose.Error.ValidationError) {
                res.status(500).render('signup', {errorMessage: err.message})
            } else if (err.code === 11000) {
                res.render('signup', {errorMessage: "This user already registered"})
            } else {
                next (err)
            }
        })
})
router.get('/user', (req, res, next) => {
    res.render('user')
})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const {username, password} = req.body

    console.log(req.body)

    let currentUser
    if (!username || !password) {
        res.render('login', { errorMessage: "Pls, put your name and password"})
    } else {
        User.findOne({username})
        .then(data => {
            if (data) {
                currentUser = data
                return bcrypt.compare(password, data.password)
            }
        })
        .then(hashCompare => {
            if (!hashCompare) {
                res.render('login', { errorMessage: "The password is incorrect"})
            } else {
                req.session.user = currentUser
                res.render('loggedin-user')
            }

        })
        .catch(err => [
            next(err)
        ])
    }

    


})

module.exports = router;

/* else if (username === req.body.username && !bcrypt.compare(password, req.body.password)) {
    res.render('login',  { errorMessage: "Password is incorrect"})
} */