const express = require('express')
const router = express.Router()

// import controller
const { signupView, signupProcess, loginView, loginProcess } = require('../controllers/auth')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

// Auth routes

router.get('/signup', signupView)
router.post('/signup', signupProcess)

router.get('/login', loginView)
router.get('/login', loginProcess)

module.exports = router
