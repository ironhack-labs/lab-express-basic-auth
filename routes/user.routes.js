const express = require('express')
const { isLoggedIn } = require('../middleware/route-guard')
const router = express.Router()

router.get('/', isLoggedIn, (req, res) => {
    res.render('user/profile', { user: req.session.currentUser })
})

module.exports = router