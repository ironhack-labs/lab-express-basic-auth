const router = require('express').Router()
const {isLoggedIn} = require('./../middleware/route-guard')

//Routes for users

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', { user: req.session.currentUser } )
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('users/user-main', { user: req.session.currentUser } )
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('users/user-private', { user: req.session.currentUser } )
})

module.exports = router