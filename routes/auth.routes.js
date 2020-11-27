const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');


const bcrypt = require('bcryptjs');
const saltRounds = 10;
 
router.get('/signup', (req, res) => res.render('auth/signup'));
 
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;

    bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            username,
            passwordHash: hashedPassword
        });
    })
    .then(userFromDB => {
        console.log(`Newly created user is: `, userFromDB);
        res.redirect('/userProfile');
    })
    .catch(error => next(error));
});

router.get('/userProfile', (req, res) => res.render('users/user-profile'));

 
module.exports = router;