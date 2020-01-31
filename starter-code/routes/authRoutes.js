const router = require('express').Router()

const {
    loginView,
    loginPost,
    signupView,
    signupPost,
    welcomeView,
    logout
} = require('../controllers/auth.controller')
const {isLoggedIn} = require('../middlewares/middle')

router.get('/', loginView)
router.get('/login', loginView)
router.post('/login', loginPost)
router.get('/signUp', signupView)
router.post('/signUp', signupPost)
router.get('/welcome', isLoggedIn, welcomeView)
router.get('/logout', logout)

module.exports = router
