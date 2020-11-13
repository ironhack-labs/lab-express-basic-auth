const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose')
const User     = require('../models/User.model')
const bcrypt   = require('bcryptjs')
const bcryptsalt = 10

router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', (req, res, next) => {
    const username = req.body.username
    const pwd = req.body.password
    if(username === '' || pwd === '') {
        res.render('signup', {errorMessage: 'Need username & password'})
    } else{
        User.findOne({username: username})
        .then(user =>{
            if(user){
                res.render('signup', {errorMessage: 'This username already exists'})
            }else {
                bcrypt.genSalt(bcryptsalt)
                .then(salt => {
                    bcrypt.hash(req.body.password, salt)
                    .then(hashedPwd => {
                        const user = {...req.body, password: hashedPwd}
                        User.create(user)
                        .then(user => {
                            req.session.currentUser = user.username
                            res.redirect('/user-page')
                        })
                    })
                })
            }
        })
        .catch(err => {
            res.redirect('/auth/signup')
            console.error(err)
        })
    }
})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const username = req.body.username
    const pwd = req.body.password
    if(username === '' || pwd === ''){
        res.render('login', {errorMessage: 'You need to write something!'})
    }else {
        User.findOne({username: username})
        .then(user => {
            if(!user){
                res.render('login', {errorMessage: 'User or password incorrect'})
            }else {
                bcrypt.compare(pwd, user.password)
                .then(user => {
                    if(user){
                        req.session.currentUser = username
                        res.redirect('/user-page')
                    }else{
                        res.render('login', {errorMessage: 'User or password incorrect'})
                    }
                })
            }
        })
        .catch(err => {
            res.redirect('/auth/login')
            console.error(err)
        })
    }
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/auth/login')
    })
})

module.exports = router