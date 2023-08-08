const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middlewares/route-guard')

router.get('/main', isLoggedIn, (req, res) => {
  res.render('user/main-page', { loggedUser: req.session.currentUser })
})

router.get('/private', isLoggedIn, (req, res) => {
  res.render('user/private-page', { loggedUser: req.session.currentUser })
})

router.get('/private/magic', isLoggedIn, (req, res) => {
  res.render('user/magic', { loggedUser: req.session.currentUser })
})

module.exports = router
