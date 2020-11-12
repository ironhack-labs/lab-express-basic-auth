const express = require('express');
const router = express.Router();
const User = require('../models/User.model');


const bcrypt = require('bcryptjs');
const saltRounds = 10;                  //delay preventing brute force attacs - it tooks 10 sec to get a response





/* GET home page */

router.get('/', (req, res, next) => {
    if (req.session.user) {
        res.render('index', { username: req.session.user.username })
    } else {
        res.render('index')
    }
});

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

router.get('/login', (req, res) => res.render('login'));


router.post('/login', (req, res) => {
    console.log('SESSION =====> ', req.session); // req.session === {}

    // find the user by their username
    User.findOne({ username: req.body.username }).then((user) => {

        if (!user) {
            // this user does not exist
            res.render('login', { errorMessage: 'username does not exist' })
        } else {

            // check if the password is correct
            if (bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
                req.session.user = user
                // res.send('password correct - logged in')
                res.redirect('/protected')
            } else {
                res.render('login', { errorMessage: 'password wrong' })
            }

        }

    })

})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/main', (req, res) => {
    res.render('main')
});


router.get('/protected', (req, res) => {

    if (!req.session.user) {
        res.redirect('/login')
    } else {
        res.render('main')
        // res.send('main')
        
    }

})

router.get('/private', (req, res) => {
    res.render('private')
});

module.exports = router;

