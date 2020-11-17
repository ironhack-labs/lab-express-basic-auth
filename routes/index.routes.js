const { Router } = require('express');
const express = require('express');
const User = require('../models/User-model');
const router = express.Router();
//const bcrypt = require('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


//ITERATION 1: SIGN-UP ROUTES

router.get('/sign-up', (req, res, next)=>{
    res.render('signUp')
})


router.post('/sign-up', (req, res, next)=>{
    
    const {email, password} = req.body

    User.findOne({email: email})
    .then(result => {
        if(email.length === 0 || password.length < 8) {
            res.render('logIn', {message: 'Error: Invalid email or password'})
        } else if(result) {
            res.render('logIn', {message: 'This email is already in use'})
        } else {
            bcrypt.genSalt(10)
            .then(salt => {
                bcrypt.hash(password, salt)
                .then(encryptedPAss => {
                    const hashedUser = {email, password: encryptedPAss}
                    User.create(hashedUser)
                    .then(() => {
                        res.redirect('/')
                    })
                })
            })
        }
    })
    .catch(err => {
        console.log(err)
        return err
    })
})


//ITERATION 2: LOG-IN ROUTES
router.get('/log-in', (req, res, next) => {
    res.render('logIn')
})


router.post('/log-in', (req, res, next) => {
    const {email, password} = req.body

    User.findOne({email: email})
    .then(result => {
        if(!result) {
            res.render('logIn', {message: "Wrong email. Please try again"})
        } else {
            bcrypt.compare(password, result.password)
            .then(compare => {
                if(!compare) {
                    res.render('logIn', {message: "Wrong password. Please try again"})
                } else {
                    req.session.currentUSer = email
                    res.redirect('/')
                }
            })
        }
    })
    .catch(err => {
        console.log(err)
        return err
    })

})


//ITERATION 3: PROTECTED ROUTES

router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {                         
      res.redirect('/log-in');
    }
});
router.get('/main', (req, res, next) => {
    res.render('main-view')
})
  

router.use((req, res, next) => {
    if(req.session.currentUser) {
        next()
    } else {
        res.redirect('/log-in')
    }
})
router.get('/private', (req, res, next) => {
    res.render('private-view')
})


module.exports = router;
