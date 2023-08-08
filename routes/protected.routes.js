const express = require('express')
const router = express.Router()

const { isLoggedIn } = require('../middleware/route-guard')

router.get('/main', isLoggedIn, (req, res) => {
	res.render('protected/main')
})

router.get('/private', isLoggedIn, (req, res) => {
	res.render('protected/private')
})

module.exports = router
