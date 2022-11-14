const router = require('express').Router()
const bcrypt = require('bcryptjs')
const UserModel = require('../models/User.model')

const SALT_ROUNDS = 10

// ---- GET ----
router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.get('/user', (req, res) => {
    const user = req.session.user
    console.log(req.session)
    res.render('user/index', user)
})

// ---- POST ----

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    Bcrypt
        .getSalt(SALT_ROUNDS)
        .then((salt) => {
            return bcrypt.hash(password, salt)
        })
        .then((hash1) => {
            return UserModel.signup({ username, password: hash1 })
        })
        .then((user) => {
            res.render('auth/user', user)
        })
        .catch((err) => next(err))
})

module.exports = router