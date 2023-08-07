const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')

const saltRounds = 10


router.get('/register', (req, res) => {
    res.render('auth/register')
})



router.post('/register', (req, res, next) => {

    const { username, password } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))

})


router.get('/login', (req, res) => {

    res.render('auth/login')
})

router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Fill the form' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'User not found' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Incorrect Password' })
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/')


        })

        .catch(err => next(err))
})


router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))

})



module.exports = router