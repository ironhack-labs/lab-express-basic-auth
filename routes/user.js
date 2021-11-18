const router = require('express').Router()

//Models
const User = require('../models/User.model')

const { isLoggedIn } = require('../middleware/route-guard')

//GET profile page
router.get('/profile', isLoggedIn, (req, res) => {
  const { username } = req.session.loggedUser
  res.render('profile', { username })
})

// GET main page
router.get('/main', isLoggedIn, (req, res) =>  {
  res.render('main')
})

module.exports = router
