const router = require("express").Router()
const User = require("../models/User.model")
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/main", isLoggedIn, (req,res,next)=>{
    console.log("req.session:", req.session);

    const user = req.session.currentUser
    res.render("userFolder/main", {user})
})

router.get("/private", isLoggedIn, (req,res,next)=>{
    console.log("req.session:", req.session);

    const user = req.session.currentUser
    res.render("userFolder/private", {user})
})

module.exports = router;