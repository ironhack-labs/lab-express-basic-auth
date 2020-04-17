const express = require('express')
const router = express.Router()
const { vistaSignup, procesoSignup } = require('../controllers/auth')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/signup', vistaSignup)

router.post('/signup', procesoSignup)

module.exports = router
