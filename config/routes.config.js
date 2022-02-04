const express = require('express');
const router = express.Router();

const common = require('../controllers/common.controller');
const auth = require('../controllers/auth.controller');

/* Common route */

router.get('/', common.home);

/* Register routes */

router.get('/register', auth.register);

router.post('/register', auth.doRegister)


module.exports = router;