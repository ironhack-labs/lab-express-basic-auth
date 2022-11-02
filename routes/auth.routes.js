const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');

//* SIGNUP NEW USER

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', async (req, res, next) => {

    try {
        const {username, email, password} = req.body;

        const salt = await bcrypt.genSalt(14);
    
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const createdUser = await User.create({username, email, password: hashedPassword});

        res.redirect('/');
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', { errorMessage: ' An account with these credentials already exists.' });
        }
        next(error);
    }
});

//* LOGIN EXISTING USER

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
    const {email, password} = req.body;
    try {
        if (!password || !email) {
            res.render('auth/login', {
                errorMessage: 'Please fill all fields.'
            });
            return;
        }

        // Finding specific User by checking given mail
        const user = await User.findOne({ email })

        // Case: Given mail not in Database
        if (!user) {
            
            res.render('auth/login', {
                errorMessage: 'User not found.',
            });
            return;

        // Case: If password matches
        } else if (bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.redirect('/profile');

        // Case: If the User exists, but Pass wrong
        } else {
            res.render(`auth/login`, {
                errorMessage: 'Wrong credentials.'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});




module.exports = router;