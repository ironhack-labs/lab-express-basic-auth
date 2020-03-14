'use strict'

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user')

/* SINGUP */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body
    if (username == "" || password == "") {
        res.send('Username and password can\'t be empty')
    } else {
        bcrypt.hash(password, 10)
        .then(hash => {
            return User.create({
                username: username,
                password: hash
            })
            .then(user => {
                res.send('WELCOME!!!')
                console.log(username)
            })
        })
        .catch(error => {
            if (error.code == '11000') {
                res.send('The username can\'t be repeated.')
            } 
            else {
               res.send('The fields can\'t be empty')
            }  
            console.log(error)
        })
    }

})

/* LOGIN */
router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    let theUser
    User.findOne({username: username})
        .then(user => {
            theUser = user
            if(!user) {
                res.send('username not found')
                throw('username not found')
            }
            return bcrypt.compare(password, user.password)
        })
        .then(passwordCorrect => {
            if(!passwordCorrect) {
                res.send('password incorrect')
                return
            }
            req.session.user = theUser
            res.send(`Welcome back, ${theUser.username}`)
        })
        .catch(e => {
            next(e)
        })
})

/* LOGOUT */
router.get('/logout', (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})



module.exports = router;