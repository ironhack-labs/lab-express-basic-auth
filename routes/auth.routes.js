const router = require('express').Router()
const bcrypt = require('bcryptjs')
const userModel = require('../models/User.model')

const SALT_ROUNDS = 10

// -------- GET --------
router.get('/signUp', (req, res) => {
    res.render('auth/signUp')
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.get('/user', (req, res) => {
    const user = req.session.user
    console.log(req.session)
    res.render('user/index', user)
})

// -------  POST --------

router.post('/signUp', (req, res, next) => {
    const { username, password } = req.body

    Bcrypt
        .getSalt(SALT_ROUNDS)
        .then((salt) => {
            return bcrypt.hash(password, salt)
        })
        .then((hash1) => {
            return userModel.signUp({ username, password: hash1 })
        })
        .then((user) => {
            res.render('auth/user', user)
        })
        .catch((err) => next(err))
})

module.exports = router