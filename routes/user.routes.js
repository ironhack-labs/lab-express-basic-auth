const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard')
router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private')
})

router.get('/main', (req, res) => {
    res.render('user/main')
})


module.exports = router