const express = require('express')
const router = express.Router()
const isLoggedIn = require('./../middleware/route-guard')

router.get('/main', isLoggedIn, (req, res) => {
    res.render('otherRoutes/main')
})

module.exports = router