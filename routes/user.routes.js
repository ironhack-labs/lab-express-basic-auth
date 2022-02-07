const router = require("express").Router()

const { isLoggedIn} = require("../middleware/route-guard")

//MAIN logged
router.get("/main", isLoggedIn, (req, res, next)=>{
    res.render("users/main", {user: req.session.currentUser})
})


//PRIVATE logged
router.get("/private", isLoggedIn, (req, res, next)=>{
    res.render("users/private", {user: req.session.currentUser})
})

//
router.get("/", isLoggedIn, (req, res, next)=>{
    res.render("layout", {user: req.session.currentUser})
})

module.exports = router