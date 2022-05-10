const router = require("express").Router()
const User = require('../models/User.model')
const isLoggedIn = require('../middleware/isLoggedIn')
const isLoggedOut = require('../middleware/isLoggedOut')

router.get("/userWelcome", (req, res) => {
        res.render("users/user-welcome")
})

router.get("/userProfile", (req, res) => {
    res.render("users/user-profile", {currentUser: req.sessionUser})
})

router.get("/main",isLoggedIn, (req, res) => {
const isLoggedIn = req.session?.currentUser ? true :false
        res.render("users/main", {isLoggedIn})
})

router.get("/private",isLoggedIn, (req, res) => {
    const isLoggedIn = req.session?.currentUser ? true :false
    const {_id}=req.session.currentUser
        User.findById(_id)
        .then(userFound=>{
            console.log(userFound)
            res.render("users/private", {userFound,isLoggedIn})
        })
    })


module.exports = router