//jshint esversion:8
const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPass => {
            //console.log(`Password hash: ${hashedPass}`);
            return User.create({username, password: hashedPass});
        })
        .then(userFromDB => {
            console.log('Newly created user is: ', userFromDB);
            res.redirect('/userProfile');
        })
        .catch(error => next(error));

});
module.exports = router;