const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/login', (req, res) => res.render('auth/login'))
router.get('/signup', (req, res) => res.render('auth/signup'))

module.exports = router;
