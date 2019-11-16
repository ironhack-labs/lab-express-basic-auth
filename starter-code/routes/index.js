const express = require('express');
const router = express.Router();
const {
	home,
	signUpView,
	signUpProcess,
	loginView,
	loginProcess,
	main,
	private
} = require('../controllers/index.controller');
const checkSession = require('../middlewares/checkSession');

/* GET home page */
router.get('/', home);
router.get('/signup', signUpView);
router.post('/signup', signUpProcess);
router.get('/login', loginView);
router.post('/login', loginProcess);
router.get('/main', checkSession, (req, res) => {
	res.render('main');
});
router.get('/private', checkSession, (req, res) => {
	res.render('private');
});

module.exports = router;
