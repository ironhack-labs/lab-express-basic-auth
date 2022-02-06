const express = require('express')
const router = express.Router();

const common = require('../controllers/common.controller')
const auth = require('../controllers/auth.controller')

router.get('/', common.home)

router.get('/signup', auth.signup)
router.post('/signup', auth.doSignup)

router.get('/login', auth.login)
router.post('/login', auth.doLogin)

module.exports = router;
