const router = require("express").Router()
const bcrypt = require('bcryptjs')
const User = require('./../models/User.model')
const { Session } = require("express-session")
const saltRounds = 10
const { isLoggedOut } = require('../middlewares/route-guard')
const { isLoggedIn } = require('../middlewares/route-guard')

router.get('/user', isLoggedIn, (req, res, next) => {
    res.render('user/profile', { user: req.session.currentUser })
})

router.get('/logged', isLoggedIn, (req, res, next) => {
    res.render('user/logged', { user: req.session.currentUser })
})


module.exports = router