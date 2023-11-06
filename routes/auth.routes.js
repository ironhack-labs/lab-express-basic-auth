const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('./../models/User.model')
const saltRounds = 10

router.get('/register', (req, res) => {

    res.render('auth/signup')

})

router.post('/register', (req, res) => {

    const { email, realPassword, firstName, lastName, address } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(realPassword, salt))
        .then(newPassword => User.create({ email, password: newPassword, firstName, lastName, address }))
        .then(res.redirect('/log-in'))
        .catch(err => console.log(err))

})

router.get('/log-in', (req, res) => {

    res.render('auth/login')

})

router.post('/log-in', (req, res) => {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Email and password needed.' })
        return
    }

    User
        .findOne({ email })
        .then(myUser => {

            if (!myUser) {
                res.render('auth/login', { errorMessage: 'Incorrect email.' })
                return
            }

            if (!bcrypt.compareSync(password, myUser.password)) {
                res.render('auth/login', { errorMessage: 'Incorrect password.' })
                return
            }

            req.session.currentUser = myUser
            res.redirect('/')

        })
        .catch(err => console.log(err))

})

router.get('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router