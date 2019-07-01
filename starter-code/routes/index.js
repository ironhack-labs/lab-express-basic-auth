const express = require('express')
const router  = express.Router()
const { getSignup, getLogin, postSignup, postLogin } = require('../controllers/authController')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', getSignup)
router.get('/login', getLogin)

router.post('/signup', postSignup)
router.post('/login', postLogin)

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/auth/login')
  })
})


// Check session and render views.
function checkSession(req, res, next) {
  if (req.session.currentUser) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/main', checkSession, (req, res) => {
  res.render('main')
})

router.get('/private', checkSession, (req, res) => {
  res.render('private')
})
module.exports = router
