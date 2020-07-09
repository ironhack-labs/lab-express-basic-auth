const express = require('express')
const router = express.Router()
const signup = require('../controllers/signup.controller')

/* GET home page */
router.get('/', signup.drawIndex)

router.get('/signup', signup.drawSignup)

router.post('/signup', signup.createUser)

module.exports = router
