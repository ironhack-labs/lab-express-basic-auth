const express = require('express');
const router = express.Router();

//add salt
const bcrypt = require('bcrypt')
const saltRounds = 10

const User = require('../models/User.model')

router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    console.log(req.body)
    bcrypt.hash(password, saltRounds)
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then(data => {
            console.log(data)
            res.redirect('/auth/user')
        })
        .catch(err => {
            next(err)
        })
})
router.get('/user', (req, res, next) => {
    res.render('user')
})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const {username, password} = req.body

    let currentUser

    User.findOne({username})
        .then(data => {
            if (data) {
                currentUser = data
                return bcrypt.compare(password, data.password)
            }
        })
        .then(hashCompare => {
            if (!hashCompare) {
                return res.send('password is incorrect')
            }
            req.session.user = currentUser
            res.render('loggedin-user')
        })
        .catch(err => [
            next(err)
        ])
})

module.exports = router;