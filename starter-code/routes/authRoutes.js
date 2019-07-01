const express = require('express')
const router = express.Router()
const { getSignUp, postSignUp, getLogin, postLogin } = require('../controllers/auth.controllers')

router.get('/signup', getSignUp)
router.post('/signup', postSignUp)
router.get('/login', getLogin)
router.post('/login', postLogin)

module.exports = router