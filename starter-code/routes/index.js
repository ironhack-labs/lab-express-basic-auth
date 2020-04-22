const express = require('express');
const router = express.Router();
const authRequire = require('../middlewares/authRequire');

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index', {
		success: req.flash('success'),
	});
});

router.get('/main', authRequire, (req, res, next) => {
	res.render('main');
});

router.get('/private', authRequire, (req, res, next) => {
	res.render('private');
});

module.exports = router;
