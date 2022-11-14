const express = require('express')
const router = express.Router()

const { isLoggedIn } = require('./../middleware/route-guard')



router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/homepage', { user: req.session.currentUser })
})

router.get('/profile', (req, res) => {
    res.render('user/profile')
})

module.exports = router