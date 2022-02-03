const express = require('express');
const router = express.Router();


const common = require('../controllers/common.controller');
//const auth = require('../controllers/auth.controller');


// COMMON routes //
router.get('/', common.home);

module.exports = router;