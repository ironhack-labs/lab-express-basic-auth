const express = require('express');
const router = express.Router();
const checkLogin = require('../middleware/checkLogin')

router.get('/main', checkLogin, (req, res, next) => {
    res.render('main')
})

router.get('/', checkLogin,( req, res, next) => {
    res.render('private')
})

module.exports = router;