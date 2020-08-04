const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.model.js')
const bcryptjs = require('bcryptjs')


router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs')
})

router.get('/login', (req, res) => {
    res.render('auth/login.hbs')
})

router.post('/signup', (req, res) => {
    const {username, password} = req.body

    if(!username || !password) {
        res.status(500).render('auth/signup.hbs', {errorMessage: 'Please enter all details'})
    }

    const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
    if(!passReg.test(password)) {
       res.status(500).render('auth/signup.hbs', {errorMessage: 'Password must be 6 characters and must have a number and a string'})
       return;
    }

    bcryptjs.genSalt(10)
        .then((salt) => {
            bcryptjs.hash(password, salt)
            .then((hashPass) => {
                UserModel.create({username, passwordHash: hashPass})
                    .then(()=>{
                        res.redirect('/')
                    })
            })
        })
 
})


router.post('/login', (req, res) => {
    const {username, password} = req.body

    if(!username || !password) {
        res.status(500).render('auth/login.hbs', {errorMessage: 'Please enter all details'})
    }
    
    UserModel.findOne({username: username})
        .then((userData) => {

            let doesItMatch = bcryptjs.compareSync(password, userData.passwordHash);

            if(doesItMatch) {
                console.log(req.session)
                req.session.loggedInUser = userData
                res.redirect('/profile')
            } else {
                res.status(500).render('auth/login.hbs', {errorMessage: 'Passwords do not match'})

            }
        })

})

router.get('/profile', (req, res) => {
    if (req.session.loggedInUser){
        res.render('users/profile.hbs', {loggedInUser: req.session.loggedInUser})
    }
    else {
        res.redirect('/login')
    }
    
})

router.get('/profile/private', (req, res) => {
    res.render('users/private.hbs')
})

router.get('/profile/main', (req, res) => {
    res.render('users/main.hbs')
})

module.exports = router;