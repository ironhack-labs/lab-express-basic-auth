const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    const { username, password}  = req.body


    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
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
        .catch (err => {
            next(err)
        })
})


router.get('/user-profile', (req, res, next)=> {
    res.render('auth/user-profile')
})


router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    const { username, password} = req.body

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to login. '
        })
        return
    }

    User.findOne( {username})
        .then(user => {
            if(!user) {
                res.render('auth/login', { errorMessage: 'Username is not registered. Try with other email.'})
                return
            } else if (bcrypt.compareSync(password, user.password)) {
                res.render('auth/user-profile',  {user} )
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password'})
            }
        })
        .catch(err => next(err))
})

module.exports = router