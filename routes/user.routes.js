const router = require('express').Router()

const isLoggedIn = require('./../middleware/route-guard')

router.get('/main', isLoggedIn, (req, res) => {
    res.render('userlimited/limited1')
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('userlimited/limited2')
})

module.exports = router
