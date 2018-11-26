const express = require('express')
const router  = express.Router()

const isLogged = (req, res, next) => {
  const user = req.session.currentUser
  if (!user) return res.redirect('/auth/login')
  else next()
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
});

router.get('/private', isLogged, (req, res) => {
  res.render('private')
})

router.get('/main', isLogged, (req, res) => {
  res.send('main')
})

module.exports = router
