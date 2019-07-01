const express = require('express')
const router = express.Router()
const {
  getSignup,
  postSignup,
  getLogin,
  postLogin
} = require('../controllers/authControllers')

router.get('/signup', getSignup)
router.post('/signup', postSignup)
router.get('/login', getLogin)
router.post('/login', postLogin)
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/auth(login')
  })
})

module.exports = router