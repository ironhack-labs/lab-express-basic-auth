const router = require("express").Router();

const { isLoggedIn } = require('./../middleware/session-guard')
console.log(isLoggedIn)

router.get("/my-profile-main", (req, res) => {
    res.render("user/my-profile-main")
})

router.get("/my-profile-private", (req, res) => {
    res.render("user/my-profile-private")
})


router.get('/my-profile-main', isLoggedIn, (req, res) => {
    res.render('user/my-profile-main', { user: req.session.currentUser })
})

router.get('/my-profile-private', isLoggedIn, (req, res) => {
    res.render('user/my-profile-private', { user: req.session.currentUser })
})


module.exports = router
