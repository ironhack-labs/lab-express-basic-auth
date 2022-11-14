const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const UserModel = require('../models/User.model')

router.get('/create', (req, res) => {
    res.render('auth/create')
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.get('/user', (req, res) => {
    const user = req.session.user
    res.render('user/index', user)
})

router.post('/create', (req, res, next) => {
    const { username, password } = req.body

    UserModel.create({ username, password })
        .then(() => {
            res.redirect('/auth/login')
        })
        .catch((err) => {
            next(err)
        })
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    UserModel.findOne({ username })
        .then((user) => {
            if (!user) {
                res.render('login', {
                    messageError: 'Email o contraseña incorrectos',
                })
                return
            }
            const verifyPass = bcrypt.compareSync(password, user.password)

            if (verifyPass) {
                req.session.user = user
                res.redirect('/auth/login')
            } else {
                res.render('auth/login', {
                    messageError: 'Email o contraseña incorrectos.'
                })
            }
        })
})

module.exports = router
