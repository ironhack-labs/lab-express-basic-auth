const router = require("express").Router()
const User = require("../models/User.model")
const {isLoggedIn} = require ('../middleware/route-guard')

router.get('/userProfile',isLoggedIn,(req,res)=> {
    res.render('user/user-profile',{currentUser:req.session.currentUser})
})

module.exports = router

