const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')
const router = express.Router()


const User = require('../models/User.model')

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render("content/private-view")
})
module.exports = router