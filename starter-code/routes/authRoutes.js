const express = require('express')
const router = express.Router()
const { postSignUp, getLogin, postLogin } = require('../controllers/auth.controllers')

router.post('/signup', postSignUp)
router.get('/login', getLogin)
router.post('/login', postLogin)

module.exports = router