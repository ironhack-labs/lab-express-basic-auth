const express = require('express')
const router = express.Router()
const signup = require('../controllers/signup.controller')
const sessionMiddleware = require('../middlewares/session.middleware')

/* GET home page */
router.get('/', signup.drawIndex)

router.get('/login', signup.drawLogin)
router.post('/login', signup.doLogin)

router.get('/signup', signup.drawSignup)
router.post('/signup', signup.createUser)

router.get('/profile', sessionMiddleware.isAuthenticated, signup.drawProfile)

router.post("/logout", sessionMiddleware.isAuthenticated, signup.logout)

module.exports = router
