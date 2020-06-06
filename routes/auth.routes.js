const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = new Router();
const User = require('../models/User.model');

const saltRounds = 10;

router.get('/signup', (req, res) => res.render('auth/signup'));
router.get('/userProfile', (req, res) => res.render('users/user-profile'));

router.post('/signup', (req, res, next) => {
    const {username, email, password} = req.body;

    bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
        // Create the user in the db
        return User.create({username: username, email: email, passwordHash: hashedPassword}); // We can access this outside because we return the promise
    })
    // We catch the promise outside #yasss
    .then(data => {
        console.log(`User created: ${data}`);
        res.redirect('/userProfile');
    })
    .catch(e => next(e));
});

module.exports = router;