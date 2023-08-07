const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const user = require('../models/User.model');
const { isLoggedOut } = require('../middlewares/route-guard')

const saltRounds = 10

//Signup from (render)

router.get('/signup', isLoggedOut, (req, res) => {

    res.render('signup-form')
})

//Signup from (hendler)

router.post('/signup', (req, res, next) => {

    const { username, email, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hash => user.create({ username, email, password: hash }))
        .then(() => res.redirect('/log-in'))
        .catch(err => next(err))
})

//login form (render)

router.get('/log-in', (req, res, next) => {

    res.render('login-form')
})

//login form (handler)

router.post('/log-in', (req, res, next) => {

    const { email, plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {
        res.render('login-form', { errorMessage: 'field all the gaps' })
        return
    }
    user
        .findOne({ email })
        .then(foundUser => {

            if (!foundUser) {
                res.render('login-form', { errorMessage: 'User not found' })
                return
            }

            if (!bcrypt.compareSync(plainPassword, foundUser.password)) {
                res.render('login-form', { errorMessage: 'Incorrect password' })
                return
            }

            req.session.currentUser = foundUser // You are Logged! 
            res.redirect('/protect')

        })
        .catch(err => next(err))

})

router.get('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router