const express = require('express');
const router = express.Router();

const common = require('../controllers/common.controller');
const auth = require('../controllers/auth.controller');
const user = require('../controllers/user.controller');
const { isAuthenticated } = require('../middlewares/auth.middlewares')

/* Common route */

router.get('/', common.home);

/* Register routes */

router.get('/register', auth.register);
router.post('/register', auth.doRegister);

/* Login-logout routes */

router.get('/login', auth.login);
router.post('/login', auth.doLogin);
router.get('/logout', auth.logout)

/* User route */

router.get('/view-profile', isAuthenticated, user.profile)

module.exports = router;