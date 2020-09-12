const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', (req, res, next) => {
    const {username,password} = req.body

    if (!username || !password) {
        res.render('signup', {errorMessage: 'Please provide a username and a password.'})
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
    if(!regex.test(password)) {
        res.status(500).render('signup', {errorMessage: 'Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.'})
        return
    }

    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then(() => {
            res.send('User created')
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('signup', {errorMessage: error.message})
            } else if (error.code === 11000) {
                res.status(500).render('signup', {errorMessage: 'Username already exists.'})
            } else {
            next(error)
            }
        })
})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const {username,password} = req.body

    if(!username || !password) {
        res.render('login', {errorMessage: 'Please enter both username and password.'})
    }

    let currentUser

    User.findOne({username})
        .then(user => {
            if(user) {
                currentUser = user
                return bcrypt.compare(password, user.password)
            }
        })
            .then(hashMashed => {
                if(!hashMashed) {
                    return res.send('Password is incorrect')
                }
                req.session.user = currentUser
                res.send('Password is correct')
            })
            .catch(e => {
                next(e)
            })
})

module.exports = router