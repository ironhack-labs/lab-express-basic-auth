const express = require('express')
const router = express.Router()

const { isLoggedIn } = require('../middleware/route-guard')

router.get("/private", isLoggedIn, (req, res) => {
   
    res.render('user/private',{ usuarito: req.session.currentUser })
    console.log(req.session.currentUser)
} )

router.get("/main", (req, res) => {
    res.render('user/main')
    console.log('-------------------------------------------holin')
    
} )

module.exports = router




