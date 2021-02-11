const express = require('express');
const router = express.Router();
const secure = require('../middleware/secure.middleware')

/* GET home page */
router.get('/', secure.isNotAuthenticated,(req, res, next) => res.render('index'));

module.exports = router;
