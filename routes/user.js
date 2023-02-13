const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')


const User = require('./../models/User.model')

const saltRounds = 10


//Register

router.get('/register', (req, res) => {

    res.render('register-form')
})

router.post('/register', (req, res) => {

    const { username, email, userPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(passwordHash => User.create({ email, username, password: passwordHash }))
        .then(user => res.redirect('/'))
        .catch(err => console.log(err))
})

//Login - Sign in

router.get('/signin', (req, res) => {
    res.render('sign-form')
})

router.post('/signin', (req, res) => {

    const { email, userPassword } = req.body

    if (email.length === 0 || userPassword.length === 0) {
        res.render('sign-form', { errorMessage: 'User or Password is empty!!!' })
        return
    }

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('sign-form', { errorMessage: 'User/Password is wrong' })
            }
            else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('sign-form', { errorMessage: 'User/Password is wrong' })
            }

            else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })



})

//Log Out
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router