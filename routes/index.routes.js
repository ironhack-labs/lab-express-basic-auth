const express = require('express');
const router = express.Router();

const bcryptjs = require('bcrypt');

const saltRounds = 10;

const User = require('../models/User.model');

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

/* GET home page */
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

/* POST sign up page */
router.post('/signup', (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        res.render('signup', { errorMessage: 'All fields are mandatory!' });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {

            return User.create({
                username,
                passwordHash: hashedPassword
            });
        })
        .then(userDoc => console.log(userDoc))
        .catch(err => console.log(err));

        res.redirect('/');
});

/*GET login page */
router.get('/login', (req, res, next) => {
    res.render('login');
})

module.exports = router;
