const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs')

const userModel = require('../models/User.model')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res) => {
    res.render('signup.hbs')
})

router.post('/signup', (req,res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(500).render('signup.hbs', {errorMessage: 'Please enter all details'});
        return;
    }

    const passwordReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
    if (!passwordReg.test(password)) {
        res.status(500).render('signup.hbs', {errorMessage: 'Please enter a valid password'});
        return;
    }

    userModel.find({username})
        .then(() => {
            res.status(500).render('signup.hbs', {errorMessage: 'Username already exists. Please enter a new username'});
        })

    bcryptjs.genSalt(10)
        .then((salt) => {
            bcryptjs.hash(password, salt)
                .then((hashPassword) => {
                    userModel.create({username, passwordHash: hashPassword})
                        .then(() => {
                            res.redirect('/')
                        })
                })
        })
        .catch((err) => {
            console.log('Error', err)     
        })
})

router.get('/signin', (req, res) => {
    res.render('signin.hbs')
})

router.post('/signin', (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(500).render('signin.hbs', {errorMessage: 'Please enter all details'});
        return;
    }

    const passwordReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
    if (!passwordReg.test(password)) {
        res.status(500).render('signin.hbs', {errorMessage: 'Please enter a valid password'});
        return;
    }

    userModel.findOne({username}) 
        .then((userData) => {
            let doesItMatch = bcryptjs.compareSync(password, userData.passwordHash)
            if (doesItMatch) {
                req.session.loggedInUser = userData;
                res.redirect('/profile')
            }
            else {
                res.status(500).render('signin.hbs', {errorMessage: 'Please enter your password'});
            }
        }).catch((err) => {
            console.log(err)
        });
})

router.get('/profile', (req, res) => {
    if (req.session.loggedInUser) {
    res.render('profile.hbs', {loggedInUser: req.session.loggedInUser})
    }
    else {
        res.redirect('/signin')
    }
})

router.get('/logout', (req,res) => {
    req.session.destroy(() => {
        
        res.redirect('/')
    })
})

router.use((req, res, next) => {
    if (req.session.loggedInUser) {
        next();
    }
    else {
        res.redirect('/signin')
    }
})

module.exports = router;
