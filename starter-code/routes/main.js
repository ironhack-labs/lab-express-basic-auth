//todo el mundo :O

const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('main');
});


module.exports = router;
