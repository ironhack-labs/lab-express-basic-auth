const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const exposeUserToView = require('../middlewares/exposeUserToView')
const isAuthenticated = require('./../middlewares/isAuthenticated')

router.get('/profile', isAuthenticated, exposeUserToView, (req, res, next) => {
    res.render('profile')
})

router.get('logout', (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error)
        }
    })
})

module.exports = router