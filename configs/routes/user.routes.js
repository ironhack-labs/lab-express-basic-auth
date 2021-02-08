const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user.controller')

router.get('/in', userController.in)

router.post('/login', userController.login)
router.get('/login', userController.loginView)

router.get('/thanks', userController.registerThanks)

router.get('/register', userController.registerView)
router.post('/register', userController.register)

module.exports = router;