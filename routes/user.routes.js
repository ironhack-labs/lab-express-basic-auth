const router = require("express").Router()
const bcrypt = require('bcryptjs')

//Model
const User = require('./../models/User.model')

//Middlewares
const { isLoggedOut } = require('../middlewares/route-guard')
const { isLoggedIn } = require('../middlewares/route-guard')

// Main
router.get('/main', isLoggedIn, (req, res) => {
    res.render('main')
})

// Private
router.get('/private', isLoggedIn, (req, res) => {
    res.render('private')
})

module.exports = router