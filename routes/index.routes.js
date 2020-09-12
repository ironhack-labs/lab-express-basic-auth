const express = require('express');
const checkLogin = require('../middleware/checkLogin')
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


router.get('/main', checkLogin,(req, res, next) => {
    res.render('main')
})

router.get('/private', checkLogin,(req, res, next) => {
    res.render('private')
})

module.exports = router;
