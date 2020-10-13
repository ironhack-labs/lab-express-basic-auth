const express = require('express');
const router = express.Router();

var bcrypt = require('bcryptjs');

const UserModel = require('../models/User.model')

router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs')
})

router.post('/signup', (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        res.status(500).render('auth/signup.hbs', {errorMessage: 'Not valid my man!!'})
        return;
    }

let passwordReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)
 if (!passwordReg.test(password)) {
    res.status(500).render('auth/signup.hbs', {errorMessage: 'Password must have one lowercase, one uppercase, a number, a special character, and must be between 8 and 15 characters'})
    return;
}

    bcrypt.genSalt(10)
        .then((salt) => {
            bcrypt.hash(password, salt)
                .then((hashedPassword) => {
                    UserModel.create({
                        username, password: hashedPassword
                    })
                    .then(() => {
                        res.redirect('/')
                    })
                })
        })
})

router.get('/login', (req, res) => {
    res.render('auth/login.hbs')
})

router.post('/login', (req, res) => {
    const {username, password} = req.body



    UserModel.findOne({username: username})
        .then((userData) => {
            //console.log(userData)
                if (!userData) {
                res
                .status(500)
                .render("auth/login.hbs", { errorMessage: "User does not exist" });
                return;
            }

            bcrypt.compare(password, userData.password)
                .then((result) => {
                    if (result) {
                        req.session.loggedInUser = userData
                        //console.log(req.session)
                        res.redirect('/dashboard')
                    }
                    else {
                        res.status(500).render('auth/login.hbs', {errorMessage: 'Password not matching'})
                    }
                })
                .catch(() => {
                    res.status(500).render('auth/login.hbs', {errorMessage: 'Something went wrong. Try again!'})
                })
        })
})

router.get('/dashboard', (req, res) => {
    console.log(req.session)
    res.render('dashboard.hbs', {name: req.session.loggedInUser.username})
})

router.get('/main', (req, res) => {
    res.render('main.hbs')
})

router.get('/private', (req, res) => {
    res.render('private.hbs')
})


module.exports = router;
