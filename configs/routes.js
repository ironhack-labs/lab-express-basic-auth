const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controllers')
const sessionMiddleware = require('../middlewares/session.middleware')

router.get('/', sessionMiddleware.isNotAuthenticated, usersController.login)
router.post('/', sessionMiddleware.isNotAuthenticated, usersController.doLogin)
router.get(
  '/signup',
  sessionMiddleware.isNotAuthenticated,
  usersController.signup
)
router.post(
  '/signup',
  sessionMiddleware.isNotAuthenticated,
  usersController.create
)
router.get(
  '/welcome',
  sessionMiddleware.isAuthenticated,
  usersController.welcome
)
router.post(
  '/logout',
  sessionMiddleware.isAuthenticated,
  usersController.logout
)

module.exports = router
