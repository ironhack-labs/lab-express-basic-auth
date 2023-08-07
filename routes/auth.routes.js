const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const { isLoggedOut } = require('../middlewares/route.guard')

const saltRounds = 10

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/signup', { errorMessageUsername: 'User already exists' })

                return
            } else {
                if (username.length === 0) {
                    res.render('auth/signup', { errorMessageUsername: 'Fill username field' })
                    return
                } else if (password.length === 0) {
                    res.render('auth/signup', { errorMessagePassword: 'Fill password field' })
                    return
                }

                bcrypt
                    .genSalt(saltRounds)
                    .then((salt) => bcrypt.hash(password, salt))
                    .then((hash) => User.create({ username, password: hash }))
                    .then((User) => {
                        req.session.currentUser = User
                        res.redirect('/')
                    })
                    .catch(err => next(err))
            }
        })
})

router.get('/login', isLoggedOut, (req, res) => {

    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    if (username.length === 0) {
        res.render('auth/login', { errorMessageUsername: 'Fill username field' })
        return
    } else if (password.length === 0) {
        res.render('auth/login', { errorMessagePassword: 'Fill password field' })
        return
    }


    User
        .findOne({ username })
        .then((foundUser) => {
            if (!foundUser) {
                res.render('auth/login', { errorMessageUsername: 'User not found' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessagePassword: 'Invalid password' })
                return
            }

            req.session.currentUser = foundUser

            res.render(('index'), { MessageSuccess: 'Succesfully logged in' })
        })
        .catch(err => next(err))

})






module.exports = router