const express = require('express')
const router = express.Router()

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})
router.use('/login', require('./auth.routes'))
router.use('/signup', require('./user.routes'))
router.use('/profile', require('./auth.routes'))

module.exports = router
