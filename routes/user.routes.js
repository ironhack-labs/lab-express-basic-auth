const express = require('express')
const { isLoggedIn } = require('../middleware/route-guard')
const router = express.Router()

router.get('/usuario', isLoggedIn, (req, res, next) => {
    res.render('users/profile', { user: req.session.currentUser })
})

module.exports = router 