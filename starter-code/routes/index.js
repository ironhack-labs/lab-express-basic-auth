const router = require('express').Router()
const {
  indexView,
  loginView,
  loginPost,
  signupView,
  signupPost,
  profileView,
  logout
} = require('../controllers/index.controller')

const { isLoggedIn } = require('../middlewarres/index')
/* GET home page */
router.get('/', indexView)
router.get('/signup', signupView)
router.post('/signup', signupPost)
router.get('/login', loginView)
router.post('/login', loginPost)
router.get('/profile', isLoggedIn, profileView)
router.get('/logout', logout)



module.exports = router;
