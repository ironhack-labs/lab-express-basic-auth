const router = require("express").Router()
const bcrypt = require('bcryptjs')
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard")
const User = require('./../models/User.model')

router.get('/profile', isLoggedIn, (req, res) => {

    res.render('user/profile', { user: req.session.currentUser })

})


module.exports = router
