const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

//main

router.get('/main', (req, res, next) => {
    res.render('main');
});

//Private

router.get('/private', (req, res, next) => {

    req.session.currentUser ? res.render('private') : res.redirect('/auth/login')

})



module.exports = router;