const express = require('express')
const { isLoggedOut } = require('../middlewares/route-guard')
const router = express.Router()

const User = require('../models/User.model')

router.get('/main', isLoggedOut, (req, res, next) => {
    res.render("content/main-view")
})
module.exports = router