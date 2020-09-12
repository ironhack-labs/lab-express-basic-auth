const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const checkLogin = require('../middleware/checkLogin')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    const { username, password}  = req.body


    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
      }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
        .status(500)
        .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
 
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            return User.create({ 
                username, 
                password: hashedPassword
            })
        })
        .then(newUserInDB=> {
            console.log('Newly created user is: ', newUserInDB)
            res.redirect('/auth/user-profile')
        })
        .catch(err => {
            if (err.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'Username needs to be unique, this username is already used.'
                })
            } else {
                next (err)
            }
        })
})

router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password} = req.body

    let currentUser

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to login. '
        })
        return
    }

    User.findOne( {username})
        .then(user => {
            if(!user) {
                res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.'})
                return
            } else if (bcrypt.compareSync(password, user.password)) {
                // res.render('auth/user-profile',  {user} )
                req.session.currentUser = user
                res.redirect('/auth/user-profile')
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password'})
            }
        })
        .catch(err => next(err))
})

router.get('/user-profile', (req, res, next) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });

router.get('/main', 
checkLogin,
(req, res, next ) => {
    res.render('auth/main')
})

router.get('/private', 
checkLogin,
(req, res, next) => {
    res.render('auth/private')
})

router.post('/logout', (req, res, next)=> {
    req.session.destroy();
    res.render('auth/logout')
})

module.exports = router