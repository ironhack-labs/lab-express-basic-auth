const router = require("express").Router()
const User = require("../models/User.model")

router.get('/userProfile',(req,res)=> res.render('user/user-profile'))

module.exports = router

