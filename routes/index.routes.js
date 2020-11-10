const express = require('express');
const router = express.Router();
const User = require('../models/User.model');


const bcrypt = require('bcryptjs');
const saltRounds = 10;                  //delay preventing brute force attacs - it tooks 10 sec to get a response



/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signUp', (req, res, next) => {
    res.render('signUp');
});

router.post('/signUp', (req, res, next) => {
    console.log(req.body);

    const salt = bcrypt.genSaltSync(10);
    const pwHash = bcrypt.hashSync(req.body.password, salt);

    User.create({ username: req.body.username, passwordHash: pwHash })

        .then(() => res.redirect('signUp'))

});

module.exports = router;

