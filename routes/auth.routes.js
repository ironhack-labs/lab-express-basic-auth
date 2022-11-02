const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');


router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        
        const salt = await bcrypt.genSalt(14);

        const hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = await User.create({ username, password: hashedPassword });

        res.redirect('/')
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        
        const user = await User.findOne({username});

        if (!user) {
            res.render('auth/login', {messageError: "You do not exist! Don't try again",})
            return;
        } else if ( bcrypt.compareSync(password, user.password)) {
            
            // creating the user in the session object (so that a user can have a session)
            req.session.user = user;
            res.redirect('/profile');
        } else {
            res.render('auth/login', {messageError: "Stupid! That's not your password!!!",});

        }

    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/profile', (req, res) => {
    const user = req.session.user;
    res.render('profile', user)
});

router.post('/logout', (req, res, next) => {
    if (!req.session) res.redirect('/');

    req.session.destroy((err) => {
        if (err) next(err);
        else res.redirect('/');
      });
})


module.exports = router;