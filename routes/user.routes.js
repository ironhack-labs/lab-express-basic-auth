const { isLoggedIn, } = require("../middleware/route-guard")

const router = require("express").Router()


router.get('/profile', (req, res, next) => {
    res.render('users/user-profile', { user: req.session.currentUser })
})

router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('users/user-main', { user: req.session.currentUser })

})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('users/user-private', { user: req.session.currentUser })

})
module.exports = router