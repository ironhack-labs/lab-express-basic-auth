const express = require('express')
const router = express.Router()
const { vistaSignup, procesoSignup, vistaLogin, procesoLogin } = require('../controllers/auth')
const { profile, privado } = require('../controllers/profile')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/signup', vistaSignup)

router.post('/signup', procesoSignup)

// Login
router.get('/login', vistaLogin)

router.post('/login', procesoLogin)

function checkSession(req, res, next) {
  if (req.session.currentUser) {
    next()
  } else {
    res.redirect('/login')
  }
}
// Profile

router.get('/profile', checkSession, profile)

router.get('/private', checkSession, privado)

module.exports = router
