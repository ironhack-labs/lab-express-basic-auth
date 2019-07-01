const express = require('express')
const router = express.Router()
const { getSignUp, postSignUp, getLogin, postLogin } = require('../controllers/auth.controllers')

router.get('/signup', getSignUp)
router.post('/signup', postSignUp)
router.get('/login', getLogin)
router.post('/login', postLogin)
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect("/auth/login")
  })
})

module.exports = router