const express = require('express')
const router = express.Router()
const { isLoggedOut, isLoggedIn } =require("../lib/isLoggedMiddleware")

router.get('/', isLoggedIn(), (req, res, next) => {
    res.render('private/private')
})



module.exports = router