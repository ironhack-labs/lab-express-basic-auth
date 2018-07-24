const express = require('express');
const router = express.Router();


router.get('/private', (req, res, next) => {
    res.render('main/private');
});

module.exports = router;