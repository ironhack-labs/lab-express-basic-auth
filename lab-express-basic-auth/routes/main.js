
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('auth/main');
});

router.get('/private', (req, res, next) => {
    res.render('auth/private');
});


module.exports = router;