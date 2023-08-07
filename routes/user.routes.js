const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middlewares/route-guard')


router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/main')
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private', req.session.currentUser)
})

module.exports = router