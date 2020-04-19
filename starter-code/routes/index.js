const express = require('express')
const router = express.Router()

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

// router.get('/main', (req, res, next) => {
//   res.render('main')
// })

// router.get('/profile', (req, res, next) => {
//   res.render('profile')
// })

const { signupView, signupProcess, loginView, loginProcess , mainView , profileView} = require('../controllers/auth')

// Middleware session
function checkSession(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get('/signup', signupView)
router.post('/signup', signupProcess)

router.get('/login', loginView)
router.post('/login', loginProcess)

router.get('/main', mainView)
router.get('/profile',checkSession ,profileView)

module.exports = router
