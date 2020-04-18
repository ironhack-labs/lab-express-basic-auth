const express = require('express')
const router = express.Router()

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/main', (req, res, next) => {
  res.render('main')
})

const { signupView, signupProcess, loginView, loginProcess } = require('../controllers/auth')

router.get('/signup', signupView)
router.post('/signup', signupProcess)

router.get('/login', loginView)
router.post('/login', loginProcess)

router.get('main')

module.exports = router
