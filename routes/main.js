const express = require('express')
const router = express.Router()

const { isLoggedIn } = require('./../middlewares/route-guard')


router.get('/main', isLoggedIn, (req, res) => {
    res.render('main')
})

module.exports = router