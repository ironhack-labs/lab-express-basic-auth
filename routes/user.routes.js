const router = require('express').Router()
const { isLoggedIn } = require('../middlewares/route-guard')

router.get('/main', isLoggedIn, (req, res) => res.render('user/main'))

router.get('/private', isLoggedIn, (req, res) => res.render('user/private'))

module.exports = router