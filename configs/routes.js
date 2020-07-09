const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controllers')

router.get('/', usersController.login)
router.get('/signup', usersController.signup)
router.post('/signup', usersController.create)

module.exports = router
