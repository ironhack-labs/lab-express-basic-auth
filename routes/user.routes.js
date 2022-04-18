const router = require('express').Router()

const { isLoggedIn } = require('./../middleware/route-guard')


router.get('/myprofile', isLoggedIn, (req, res) => {
    res.render('user/myprofile', { user: req.session.currentUser })
})

router.get('/main', (req, res) => {
    res.render('user/main')
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private')
    // res.send("this is private")
})

module.exports = router