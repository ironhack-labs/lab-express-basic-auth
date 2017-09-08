const express = require('express');
const userModel = require('../model/user.js');

const router = express.Router();

router.get('/signup',(req, res, next) => {
    res.render('signup');
});

router.post('/', (req, res, next) => {

});

module.exports = router;
