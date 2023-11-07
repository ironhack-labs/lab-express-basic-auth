const express = require('express')
const router = express.Router()

const { isLoggedIn } = require('../middleware/route-guard')

router.get('/profile', isLoggedIn, (req, res) =>{
    res.render('user/profile', { user: req.session.currentUser})

})

module.exports = router