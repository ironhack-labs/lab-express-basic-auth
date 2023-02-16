const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated')
const exposeUsersToView = require('./../middlewares/exposeUserToView')
const router = express.Router()

/* GET home page */
router.get('/', exposeUsersToView, (req, res, next) => {
  res.render('index')
})
router.use('/', require('./auth.routes'))
router.use('/', require('./user.routes'))

module.exports = router
