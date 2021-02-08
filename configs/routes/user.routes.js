const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user.controller')
const secure = require('../../middlewares/secure.middleware')

router.get('/register', secure.isNOTAuthenticated, userController.registerView)
router.post('/register', secure.isNOTAuthenticated, userController.register)

router.get('/thanks', secure.isNOTAuthenticated, userController.registerThanks)

router.get('/login', secure.isNOTAuthenticated, userController.loginView)
router.post('/login', secure.isNOTAuthenticated, userController.login)

router.get('/in', secure.isAuthenticated, userController.in)

router.post('/logout', secure.isAuthenticated, userController.logout)


module.exports = router;