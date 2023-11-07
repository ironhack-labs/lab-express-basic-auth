const express = require('express')
const router = express.Router()



const User = require('../models/User.model')
const { isLoggedIn } = require('../middleware/route-guard')

router.get('/profile', isLoggedIn, (req, res) => {


    res.render('profile/profile', { user: req.session.currentUser })
})




module.exports = router