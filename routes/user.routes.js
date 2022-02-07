const router = require("express").Router()

const { isLoggedIn } = require('./../middleware/route-guard')

router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("users/user-profile", { user: req.session.currentUser })
})

router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('main-cat', { user: req.session.currentUser })
})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('private', { user: req.session.currentUser })
})


module.exports = router
