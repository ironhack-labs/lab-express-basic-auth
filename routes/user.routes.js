const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')
const router = express.Router()


router.get('/profile', isLoggedIn, (req, res, next) => {
    const {email} = req.session.currentUser
    res.render('user/profile', {email})
})

router.get('/profile/cat', isLoggedIn, (req, res, next)=>{
    res.render('user/cat')
})

router.get('/profile/gif', isLoggedIn, (req, res, next) => {
    res.render('user/gif')
})

module.exports = router
