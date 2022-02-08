


const router = require("express").Router()

const {isLoggedIn} = require('./../middleware/route-guard')

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("users/private-page", {user: req.session.currentUser})
})

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("users/main-page", {user: req.session.currentUser})
})



module.exports = router 