const User = require('../models/User.model');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
});

module.exports = router