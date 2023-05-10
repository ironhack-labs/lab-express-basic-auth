const { Router } = require('express');

const bcryptjs = require('bcryptjs');

const saltRounds = 10;

const mongoose = require('mongoose');
const User = require('../models/User.model');

const router = new Router();


const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup.hbs');
});



router.post('/signup', (req, res) => {

    const { username, password } = req.body;

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!regex.test(password)) {
        res.status(500).render('auth/signup', { errorMessage: 'Password needs to have at least 6 characters, 1 lowercase letter and 1 uppercase letter' });
        return;
    }


    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please add your username, password and e-mail, if you may.' });
        return;
    }

    async function encriptPassword() {
        try {

            let salt = await bcryptjs.genSalt(saltRounds);

            let hashedPassword = await bcryptjs.hash(password, salt);


            let newUser = await User.create({
                username,
                passwordHash: hashedPassword,
            });

            res.redirect('/userProfile');
        }
        catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {

                res.status(500).render('auth/signup', { errorMessage: error.message });
            }
            else if (error.code === 11000) {
                res.status(500).render('auth/signup', { errorMessage: 'Username and email must be unoque. Choose an username / email that are original, if you may.', });
            }

            else {
                console.log(error);
            }
        }
    }

    encriptPassword();
});

router.get('/userProfile', isLoggedIn, (req, res) => {
    res.render('user/user-profile.hbs', { userInSession: req.session.currentUser });
});

router.get('/login', (req, res) => {
    res.render('auth/login.hbs');
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }

        res.redirect('/');
    })
});

module.exports = router; 