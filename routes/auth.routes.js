const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('./../models/User.model')
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard')

router.get('/register', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

router.post('/register', isLoggedOut, (req, res, next) =>{

    const{ username, plainPassword} = req.body
    

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({username, passwordHash}))
        .then(() => res.redirect('/login'))
        .catch(err => next(err))
})

router.get('/login', isLoggedOut, (req, res) =>{
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body

    if(username.length === 0 || password.length === 0){
        res.render('auth/login', { errorMessage: 'Required'})
        return
    }

    User
        .findOne({username})
        .then(foundUser => {
            if(!foundUser){
                res.render('auth/login', {errorMessage:'Username not registered'})
                return
            }
            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/login', { errorMessage: 'Try again' })
                return
            }

    req.session.currentUser = foundUser
    console.log('Welcome to hell', req.session)
    res.redirect('/')
        })
    .catch(err => next(err))
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router;

