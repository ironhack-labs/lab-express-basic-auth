const express = require('express')
const router = express.Router()

const common = require('../controllers/common.controller')
const auth = require('../controllers/auth.controller')
const user = require('../controllers/user.controller');
const { isAuthenticated } = require('../middlewares/auth.middlewares')

// Common routes //
router.get('/', common.home)

// Auth routes //
router.get('/register', auth.register)
router.post('/register', auth.doRegister)
router.get('/login', auth.login)
router.post('/login', auth.doLogin)
router.get('/logout', auth.logout)

// User routes //
router.get('/profile', isAuthenticated, user.profile)

module.exports = router;

