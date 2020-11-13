const express = require('express');
const router = express.Router();

// Iteration 1
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// Iteration 1
// Validation (BONUS part)

router.get('/signup', (req, res, next) => {
    res.render('signup');
});


router.post('/signup', (req, res, next) => {

    if (!req.body.username || !req.body.password) {
        res.render('signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
    }

    // make sure passwords are strong:
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(req.body.password)) {
        res
            .status(500)
            .render('signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    // creates salt
    // 10 stands for the number of salt rounds
    const salt = bcrypt.genSaltSync(10);

    // bcrypt.hashSync() method receives two different parameters: the password we are going to encrypt and the value of previously generated salt
    const pwHash = bcrypt.hashSync(req.body.password, salt);

    // creates an object in the database
    // req.body.password > password > same as in the form
    // passwordHash: pwHash > passwordHash > same as in the databank
    User.create({ username: req.body.username, passwordHash: pwHash }).then(() => {
        res.redirect('/');
    })
        .catch(error => {
            if (error.code === 11000) {
                res.status(500).render('signup', {
                    errorMessage: 'Username needs to be unique. This username is already taken!'
                });
            } else {
                next(error);
            }
        });

});



// Iteration 2

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', (req, res) => {
    // console.log('SESSION =====> ', req.session); // req.session === {}

    // find the user by their username
    User.findOne({ username: req.body.username }).then((user) => {

        if (!user) {
            // if user does not exist
            res.render('login', { errorMessage: 'Username is not registered. Try with other username.' })
        } else {

            // check if the password is correct
            if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
                req.session.user = user;
                res.send('Password correct - logged in.')
            } else {
                res.render('login', { errorMessage: 'Incorrect password.' })
            }
        }
    });
});



// Iteration 3


router.get('/protected', (req, res) => {

    if (!req.session.user) {
        res.render('main')
    } else {
        res.render('private')
    }

})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });


module.exports = router;
