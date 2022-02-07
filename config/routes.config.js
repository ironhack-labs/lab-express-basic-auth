const express = require('express')
const router = express.Router();

const common = require('../controllers/common.controller')
const auth = require('../controllers/auth.controller')
const user = require('../controllers/user.controller')
const { isAuthenticated } = require('../middlewares/auth.middlewares')

router.get('/', common.home)

router.get('/signup', auth.signup)
router.post('/signup', auth.doSignup)

router.get('/login', auth.login)
router.post('/login', auth.doLogin)
router.get('/logout', auth.logouot)

router.get('/profile', isAuthenticated, user.profile)

module.exports = router;
