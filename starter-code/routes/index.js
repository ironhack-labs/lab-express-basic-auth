const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const protectedRoute = require('../middleware/requireAdmin');
const User = require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/secret', requireAuth, (req, res, next) => {
	res.render('secret');
});

module.exports = router;
