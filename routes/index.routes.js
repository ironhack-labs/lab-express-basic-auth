const express = require('express');
const router = express.Router();

// Iteration 1
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// Iteration 1
router.get('/signup', (req, res, next) => {
    res.render('signup');
});


router.post('/signup', (req, res, next) => {

    const salt = bcrypt.genSaltSync(10);
    const pwHash = bcrypt.hashSync(req.body.password, salt);

    User.create({ username: req.body.username, passwordHash: pwHash }).then(() => {
        res.redirect('/')
    });

});


// Iteration 2

module.exports = router;
