const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')

const { isLoggedIn } = require('../middleware/route-guard')


router.get("/main", isLoggedIn, (req, res) => {
    res.render("user/main")
})

router.get("/private", isLoggedIn, (req, res) => {
    res.render("user/private")
})

module.exports = router;
