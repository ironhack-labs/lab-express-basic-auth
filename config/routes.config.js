const express = require('express');
const router = express.Router();

const common = require('../controllers/common.controller');
const auth = require('../controllers/auth.controller');

/* Common route */

router.get('/', common.home);

/* Register routes */

router.get('/register', auth.register);
router.post('/register', auth.doRegister);
/* router.get('/user-profile', auth.viewProfile); */

/* Login routes */

router.get('/login', auth.login);
router.post('/login', auth.doLogin);

module.exports = router;