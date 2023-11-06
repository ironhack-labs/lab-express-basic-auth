const router = require("express").Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard')

router.get('/signup', isLoggedOut, (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', isLoggedOut, (req, res, next) => {
    const { username, plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/signup', { errorMessage: 'Complete all the fields' })
        return
    }

    bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(plainPassword, salt))
        .then((passwordHash) => User.create({ username, password: passwordHash}).catch(res.render('auth/signup', { errorMessage: 'Existing username' })))
        .then(() => res.redirect('/login'))
        .catch(err => next(err))
})

router.get('/login', isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body
    console.log(username, password)

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Complete all the fields' })
        return
    }

    User
        .findOne({ username })
        .then((foundUser) => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Access denied'})
                return
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Access denied'})
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/')
        })
        .catch(err => next(err))
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router